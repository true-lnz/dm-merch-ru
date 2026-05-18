import { type WorkStageItem } from "@/shared/config/work-stages";
import { cn } from "@/shared/lib/cn";

type WorkStageCardProps = {
  stage: WorkStageItem;
  className?: string;
  numberClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
};

export function WorkStageCard({
  stage,
  className,
  numberClassName,
  titleClassName,
  descriptionClassName,
}: WorkStageCardProps) {
  return (
    <article className={className}>
      <p className={cn("font-heading leading-none uppercase", numberClassName)}>{stage.number}</p>
      <h3 className={cn("font-heading whitespace-pre-line uppercase", titleClassName)}>{stage.title}</h3>
      <p className={descriptionClassName}>{stage.description}</p>
    </article>
  );
}
