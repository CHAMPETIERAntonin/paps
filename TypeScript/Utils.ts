import { Request, Response } from "express";

export var dirname = __dirname + "/..";

export abstract class Saveable
{
	public load(obj: any): this { return this; };

	public save(): any { return {} };
}

export interface RequestFunction
{
	(req: Request, res: Response, next?: () => any): void;
}

export interface RenderFunction
{
	(req: Request, res: Response, next?: () => any): any;
}