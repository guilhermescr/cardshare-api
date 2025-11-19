import { Express } from 'express';
import {
  Route,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  Path,
  Request,
  SuccessResponse,
  Response,
  Tags,
  Security,
  Controller,
} from 'tsoa';
import { CardsService } from '../services/cards.service';
import {
  CreateCardDto,
  UpdateCardDto,
  CardDto,
  PopulatedCardDto,
  RelatedCardDto,
} from '../dtos/card.dto';
import { PaginatedResponseDto } from '../dtos/paginatedResponse.dto';
import { Request as ExpressRequest } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import { AIService, GeneratedCardResponse } from '../services/ai.service';

@Route('cards')
@Tags('Cards')
@Security('jwt')
export class CardsController extends Controller {
  private cardsService = new CardsService();
  private aiService = new AIService();

  @Get('/')
  public async getCards(
    @Request() req: ExpressRequest,
    @Query() limit?: number,
    @Query() cursor?: string,
    @Query() search?: string,
    @Query() sortBy?: 'latest' | 'most-liked',
    @Query() userId?: string
  ): Promise<PaginatedResponseDto<CardDto>> {
    const authenticatedUserId = (req as AuthenticatedRequest).user?.id;
    if (!authenticatedUserId)
      throw { status: 401, message: 'User not authenticated.' };

    const paginatedCards = await this.cardsService.getCardsCursor(
      authenticatedUserId,
      limit ?? 9,
      cursor,
      search,
      sortBy,
      userId
    );

    paginatedCards.items = paginatedCards.items.map((card) => ({
      ...card,
      isLiked: card.likes.includes(authenticatedUserId),
    }));

    return paginatedCards;
  }

  @Get('{id}')
  @Response(404, 'Card not found')
  public async getCardById(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<PopulatedCardDto | null> {
    const authenticatedUserId = (req as AuthenticatedRequest).user?.id;
    if (!authenticatedUserId)
      throw { status: 401, message: 'User not authenticated.' };

    const card = await this.cardsService.getCardById(authenticatedUserId, id);
    if (!card) throw { status: 404, message: 'Card not found.' };

    card.isLiked = card.likes.includes(authenticatedUserId);
    card.isFavorited = card.favorites.includes(authenticatedUserId);

    return card;
  }

  @SuccessResponse(201, 'Card created')
  @Post('/')
  public async createCard(
    @Request() req: ExpressRequest,
    @Body() body: CreateCardDto
  ): Promise<CardDto | null> {
    const authenticatedUserId = (req as AuthenticatedRequest).user?.id;
    if (!authenticatedUserId)
      throw { status: 401, message: 'User not authenticated.' };

    const files = (req as any).files as Express.Multer.File[];
    const card = await this.cardsService.createCard(
      authenticatedUserId,
      body,
      files
    );

    if (!card) throw { status: 500, message: 'Failed to create card.' };

    this.setStatus(201);
    return card;
  }

  @Put('{id}')
  @Response(404, 'Card not found')
  public async updateCard(
    @Request() req: ExpressRequest,
    @Path() id: string,
    @Body() body: UpdateCardDto
  ): Promise<CardDto | null> {
    const authenticatedUserId = (req as AuthenticatedRequest).user?.id;

    if (!authenticatedUserId)
      throw { status: 401, message: 'User not authenticated.' };

    const files = (req as any).files as Express.Multer.File[];

    const card = await this.cardsService.updateCard(
      authenticatedUserId,
      id,
      body,
      files
    );

    if (!card) throw { status: 404, message: 'Card not found.' };

    return card;
  }

  @Delete('{id}')
  @SuccessResponse(204, 'Card deleted')
  @Response(404, 'Card not found')
  public async deleteCard(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<void> {
    const authenticatedUserId = (req as AuthenticatedRequest).user?.id;
    if (!authenticatedUserId)
      throw { status: 401, message: 'User not authenticated.' };

    const deletedCard = await this.cardsService.deleteCard(
      authenticatedUserId,
      id
    );

    if (!deletedCard) throw { status: 404, message: 'Card not found.' };

    this.setStatus(204);
  }

  @Delete('{id}/file')
  @Response(404, 'Card not found')
  @Response(400, 'File not found in card media')
  public async removeFileFromCard(
    @Request() req: ExpressRequest,
    @Path() id: string,
    @Body() body: { fileUrl: string }
  ): Promise<CardDto | null> {
    const authenticatedUserId = (req as AuthenticatedRequest).user?.id;

    if (!authenticatedUserId) {
      throw { status: 401, message: 'User not authenticated.' };
    }

    const { fileUrl } = body;

    if (!fileUrl) {
      throw { status: 400, message: 'File URL is required.' };
    }

    return this.cardsService.removeFileFromCard(
      authenticatedUserId,
      id,
      fileUrl
    );
  }

  @Post('{id}/like')
  public async toggleLikeCard(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<PopulatedCardDto> {
    const authenticatedUser = (req as AuthenticatedRequest).user;

    if (!authenticatedUser)
      throw { status: 401, message: 'User not authenticated.' };

    const authenticatedUserId = authenticatedUser.id;

    const updatedCard = await this.cardsService.toggleLikeCard(
      authenticatedUser,
      id
    );

    updatedCard.isLiked = updatedCard.likes.includes(authenticatedUserId);
    updatedCard.isFavorited =
      updatedCard.favorites.includes(authenticatedUserId);

    return updatedCard;
  }

  @Post('{id}/favorite')
  public async toggleFavoriteCard(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<PopulatedCardDto> {
    const authenticatedUserId = (req as AuthenticatedRequest).user?.id;
    if (!authenticatedUserId)
      throw { status: 401, message: 'User not authenticated.' };

    const updatedCard = await this.cardsService.toggleFavoriteCard(
      authenticatedUserId,
      id
    );

    updatedCard.isLiked = updatedCard.likes.includes(authenticatedUserId);
    updatedCard.isFavorited =
      updatedCard.favorites.includes(authenticatedUserId);

    return updatedCard;
  }

  @Post('/generate')
  public async generateCard(): Promise<GeneratedCardResponse> {
    try {
      const generatedCard = await this.aiService.generateCard();

      if (
        !generatedCard.title ||
        !generatedCard.description ||
        !generatedCard.category ||
        !generatedCard.gradient
      ) {
        throw {
          status: 500,
          message:
            'Invalid response structure from AI API. Missing required fields.',
        };
      }

      return generatedCard;
    } catch (error) {
      console.error('Error generating card:', error);
      throw error;
    }
  }

  @Get('{id}/related')
  @Response(404, 'Card not found')
  public async getRelatedCards(
    @Request() req: ExpressRequest,
    @Path() id: string,
    @Query() limit: number = 3
  ): Promise<PaginatedResponseDto<RelatedCardDto>> {
    const authenticatedUserId = (req as AuthenticatedRequest).user?.id;
    if (!authenticatedUserId)
      throw { status: 401, message: 'User not authenticated.' };

    const relatedCards = await this.cardsService.getRelatedCards(id, limit);

    return {
      items: relatedCards,
    };
  }
}
