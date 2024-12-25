import {
  DialogHeader as BaseDialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface DialogHeaderProps {
  title: string;
  description: string;
}

export const DialogHeader = ({ title, description }: DialogHeaderProps) => {
  return (
    <BaseDialogHeader>
      <DialogTitle className="text-fitness-text">{title}</DialogTitle>
      <DialogDescription className="text-fitness-text/70">
        {description}
      </DialogDescription>
    </BaseDialogHeader>
  );
};