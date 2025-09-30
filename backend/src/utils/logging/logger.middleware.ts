import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    req.headers["x-trace-id"] = req.headers["x-trace-id"] || uuidv4();
    global.traceId = req.headers["x-trace-id"];

    next();
  }
}
