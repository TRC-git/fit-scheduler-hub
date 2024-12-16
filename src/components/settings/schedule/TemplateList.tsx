import { Card } from "@/components/ui/card"

interface Template {
  id: string
  name: string
  description?: string
}

interface TemplateListProps {
  templates: Template[]
}

const TemplateList = ({ templates }: TemplateListProps) => {
  return (
    <div className="grid gap-4">
      {templates.map((template) => (
        <Card key={template.id} className="p-4 bg-fitness-inner">
          <h4 className="text-fitness-text font-medium">{template.name}</h4>
          {template.description && (
            <p className="text-fitness-text/70 text-sm mt-1">
              {template.description}
            </p>
          )}
        </Card>
      ))}
    </div>
  )
}

export default TemplateList