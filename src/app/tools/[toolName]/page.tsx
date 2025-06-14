import { notFound } from 'next/navigation'
import { getTool, getAvailableToolIds } from '@/config/tools'
import ToolLayout from '@/components/ToolLayout'
import LootGeneratorComponent from '@/components/tools/LootGeneratorComponent'
import BattlePointsCalculatorComponent from '@/components/tools/BattlePointsCalculatorComponent'
import FearTrackerComponent from '@/components/tools/FearTrackerComponent'
import MonsterBuilderComponent from '@/components/tools/MonsterBuilderComponent'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'

interface ToolPageProps {
  params: Promise<{
    toolName: string
  }>
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { toolName } = await params
  const tool = getTool(toolName)

  if (!tool) {
    notFound()
  }

  // Component mapping
  const getToolComponent = () => {
    switch (tool.component) {
      case 'LootGeneratorComponent':
        return <LootGeneratorComponent />
      case 'BattlePointsCalculatorComponent':
        return <BattlePointsCalculatorComponent />
      case 'FearTrackerComponent':
        return <FearTrackerComponent />
      case 'MonsterBuilderComponent':
        return <MonsterBuilderComponent />
      default:
        return (
          <Card className="fantasy">
            <CardContent className="p-8">
              <div className="text-center py-12">
                <div className="text-6xl mb-4">{tool.icon}</div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  {tool.name}
                </h3>
                <p className="text-muted-foreground mb-6">
                  The interactive tool will be implemented here.
                </p>
                <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30">
                  Tool: {tool.component || `${tool.id}`}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )
    }
  }

  return (
    <ToolLayout currentToolId={toolName}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-[1075px] mx-auto">
          {/* Tool Interface - Prioritized at top */}
          {getToolComponent()}

          {/* Tool Status */}
          {tool.status === 'coming-soon' && (
            <Alert className="bg-accent/10 border-accent/30 mt-8">
              <div className="text-2xl mr-2">🚧</div>
              <AlertTitle className="text-accent font-semibold">
                Tool Under Development
              </AlertTitle>
              <AlertDescription className="text-muted-foreground">
                This tool is currently being built with all the features listed above. 
                We&apos;re working hard to bring you the best possible experience for your Daggerheart campaigns.
              </AlertDescription>
            </Alert>
          )}

          {tool.status === 'beta' && (
            <Alert className="bg-yellow-500/10 border-yellow-500/30 mt-8">
              <div className="text-2xl mr-2">⚠️</div>
              <AlertTitle className="text-yellow-600 dark:text-yellow-500 font-semibold">
                Beta Tool
              </AlertTitle>
              <AlertDescription className="text-muted-foreground">
                This tool is in beta. Some features may be incomplete or subject to change. 
                Please report any issues you encounter.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}

export async function generateStaticParams() {
  return getAvailableToolIds().map((toolName) => ({
    toolName,
  }))
} 