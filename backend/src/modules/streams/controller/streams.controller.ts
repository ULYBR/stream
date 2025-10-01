import { Controller, Get, Post, Param, Body } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from "@nestjs/swagger";
import { StreamsService } from "@app/modules/streams/service/streams.service";
import { CreateStreamDto } from "@app/modules/streams/dto/create-stream.dto";
import { Logger } from "nestjs-pino";

@ApiTags("Streams")
@Controller("api/streams")
export class StreamsController {
  constructor(
    private readonly streamsService: StreamsService,
    private readonly logger: Logger,
  ) {}

  @Get()
  @ApiOperation({
    summary: "Get all active streams",
    description: "Retrieve a list of all active streams in the platform",
  })
  @ApiResponse({
    status: 200,
    description: "List of streams retrieved successfully",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string", example: "stream-1234567890" },
          title: { type: "string", example: "Programming Stream" },
          description: { type: "string", example: "Learning React" },
          status: { type: "string", enum: ["live", "offline", "scheduled"] },
          userId: { type: "string", example: "user-123" },
          userName: { type: "string", example: "John Developer" },
          viewerCount: { type: "number", example: 125 },
          tags: { type: "array", items: { type: "string" } },
          category: { type: "string", example: "Programming" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
    },
  })
  @ApiResponse({ status: 500, description: "Internal server error" })
  async getAllStreams() {
    this.logger.log("GET /api/streams called");
    try {
      return await this.streamsService.getAllStreams();
    } catch (error) {
      this.logger.error({ error }, "Error in getAllStreams controller");
      throw error;
    }
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get stream by ID",
    description: "Retrieve detailed information about a specific stream",
  })
  @ApiParam({
    name: "id",
    description: "Unique identifier of the stream",
    example: "stream-1234567890",
  })
  @ApiResponse({
    status: 200,
    description: "Stream details retrieved successfully",
    schema: {
      type: "object",
      properties: {
        id: { type: "string", example: "stream-1234567890" },
        title: { type: "string", example: "Programming Stream" },
        description: { type: "string", example: "Learning React" },
        status: { type: "string", enum: ["live", "offline", "scheduled"] },
        userId: { type: "string", example: "user-123" },
        userName: { type: "string", example: "John Developer" },
        viewerCount: { type: "number", example: 125 },
        tags: { type: "array", items: { type: "string" } },
        category: { type: "string", example: "Programming" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
      },
    },
  })
  @ApiResponse({ status: 404, description: "Stream not found" })
  @ApiResponse({ status: 500, description: "Internal server error" })
  async getStreamById(@Param("id") id: string) {
    this.logger.log({ streamId: id }, "GET /api/streams/:id called");
    try {
      return await this.streamsService.getStreamById(id);
    } catch (error) {
      this.logger.error(
        { streamId: id, error },
        "Error in getStreamById controller",
      );
      throw error;
    }
  }

  @Post()
  @ApiOperation({
    summary: "Create new stream",
    description: "Create a new stream for the authenticated user",
  })
  @ApiBody({
    type: CreateStreamDto,
    description: "Stream creation data",
  })
  @ApiResponse({
    status: 201,
    description: "Stream created successfully",
    schema: {
      type: "object",
      properties: {
        id: { type: "string", example: "stream-1234567890" },
        title: { type: "string", example: "My Programming Stream" },
        description: { type: "string", example: "Learning React today" },
        status: { type: "string", example: "scheduled" },
        userId: { type: "string", example: "user-123" },
        userName: { type: "string", example: "John Developer" },
        viewerCount: { type: "number", example: 0 },
        tags: { type: "array", items: { type: "string" } },
        category: { type: "string", example: "Programming" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
      },
    },
  })
  @ApiResponse({ status: 400, description: "Invalid input data" })
  @ApiResponse({ status: 500, description: "Internal server error" })
  async createStream(@Body() createStreamDto: CreateStreamDto) {
    this.logger.log(
      { title: createStreamDto.title },
      "POST /api/streams called",
    );
    try {
      // TODO: Get user info from JWT token
      const mockUserId = "mock-user-id";
      const mockUserName = "Mock User";

      return await this.streamsService.createStream(
        createStreamDto,
        mockUserId,
        mockUserName,
      );
    } catch (error) {
      this.logger.error(
        { title: createStreamDto.title, error },
        "Error in createStream controller",
      );
      throw error;
    }
  }
}
