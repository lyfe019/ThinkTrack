// src/modules/self-knowledge/domain/entities/Insight.ts
import { Entity } from "../../../../shared/core/Entity";
import { UniqueEntityID } from "../../../../shared/core/UniqueEntityID";
import { Result } from "../../../../shared/core/Result";
import { ReframedInsight } from "../value-objects/ReframedInsight";

export enum InsightStatus {
  NEW = "NEW",
  ACKNOWLEDGED = "ACKNOWLEDGED",
  DISMISSED = "DISMISSED"
}

interface InsightProps {
  rawPattern: string;
  reframedText: ReframedInsight;
  evidenceLinks: UniqueEntityID[]; // Links to past FocusBlocks
  status: InsightStatus;
}

export class Insight extends Entity<InsightProps> {
  public static create(props: InsightProps, id?: UniqueEntityID): Result<Insight> {
    // Business Rule 2: Evidence-Base Requirement
    if (props.evidenceLinks.length < 3) {
      return Result.fail<Insight>("Insight requires at least 3 evidence links (FocusBlocks) to be generated.");
    }

    return Result.ok<Insight>(new Insight({
      ...props,
      status: props.status || InsightStatus.NEW
    }, id));
  }
}