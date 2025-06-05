import { notFound } from 'next/navigation'
import { getTool, getAvailableToolIds } from '@/config/tools'
import ToolLayout from '@/components/ToolLayout'
import LootGeneratorComponent from '@/components/tools/LootGeneratorComponent'
import BattlePointsCalculatorComponent from '@/components/tools/BattlePointsCalculatorComponent'

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
        <div className="max-w-4xl mx-auto">
          {/* Tool Header */}
          <div className="fantasy-card p-8 lg:p-12 mb-8">
            <div className="flex items-start space-x-6 mb-6">
              <div className="text-6xl">{tool.icon}</div>
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
                    {tool.name}
                  </h1>
                  <span className="text-sm px-3 py-1 bg-accent text-background rounded-full font-semibold">
                    {tool.category}
                  </span>
                </div>
                <p className="text-xl text-muted leading-relaxed">
                  {tool.description}
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                Features & Capabilities
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {tool.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="text-accent mt-1">✦</div>
                    <span className="text-muted">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tool Status */}
            {tool.status === 'coming-soon' && (
              <div className="bg-accent/10 border-2 border-accent/30 rounded-lg p-6">
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
              <div className="bg-warning/10 border-2 border-warning/30 rounded-lg p-6">
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

            {tool.status === 'active' && (
              <div className="bg-success/10 border-2 border-success/30 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="text-2xl">✅</div>
                  <h3 className="text-lg font-semibold text-success">
                    Tool Ready
                  </h3>
                </div>
                <p className="text-muted mb-4">
                  This tool is fully functional and ready for your Daggerheart campaigns!
                </p>
              </div>
            )}
          </div>

          {/* Tool Interface */}
          {getToolComponent()}
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