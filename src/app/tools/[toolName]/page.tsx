import { notFound } from 'next/navigation'
import { getTool, getAvailableToolIds } from '@/config/tools'
import ToolLayout from '@/components/ToolLayout'
import LootGeneratorComponent from '@/components/tools/LootGeneratorComponent'
import BattlePointsCalculatorComponent from '@/components/tools/BattlePointsCalculatorComponent'
import FearTrackerComponent from '@/components/tools/FearTrackerComponent'
import MonsterBuilderComponent from '@/components/tools/MonsterBuilderComponent'

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
          <div className="fantasy-card p-8">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">{tool.icon}</div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                {tool.name} Interface
              </h3>
              <p className="text-muted mb-6">
                The interactive tool interface will be implemented here. 
                This area will contain the actual tool functionality.
              </p>
              <div className="inline-block px-4 py-2 bg-accent/20 text-accent rounded-lg font-medium">
                Component: {tool.component || `${tool.id}-component`}
              </div>
            </div>
          </div>
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
            <div className="bg-accent/10 border-2 border-accent/30 rounded-lg p-6 mt-8">
              <div className="flex items-center space-x-3 mb-3">
                <div className="text-2xl">🚧</div>
                <h3 className="text-lg font-semibold text-accent">
                  Tool Under Development
                </h3>
              </div>
              <p className="text-muted mb-4">
                This tool is currently being built with all the features listed above. 
                We&apos;re working hard to bring you the best possible experience for your Daggerheart campaigns.
              </p>
            </div>
          )}

          {tool.status === 'beta' && (
            <div className="bg-warning/10 border-2 border-warning/30 rounded-lg p-6 mt-8">
              <div className="flex items-center space-x-3 mb-3">
                <div className="text-2xl">⚠️</div>
                <h3 className="text-lg font-semibold text-warning">
                  Beta Tool
                </h3>
              </div>
              <p className="text-muted mb-4">
                This tool is in beta. Some features may be incomplete or subject to change. 
                Please report any issues you encounter.
              </p>
            </div>
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