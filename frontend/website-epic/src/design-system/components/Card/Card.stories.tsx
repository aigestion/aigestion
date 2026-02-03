import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardHeader, CardBody, CardFooter } from './Card'

const meta: Meta<typeof Card> = {
  title: 'Design System/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'outlined', 'glass', 'neon', 'gaming'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
    hover: {
      control: 'boolean',
    },
    animated: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Default
export const Default: Story = {
  render: () => (
    <Card>
      <CardBody>
        <h3 className="text-lg font-semibold mb-2">Card Title</h3>
        <p className="text-gray-600">This is a basic card component with some content.</p>
      </CardBody>
    </Card>
  ),
}

// Variants
export const Elevated: Story = {
  render: () => (
    <Card variant="elevated">
      <CardBody>
        <h3 className="text-lg font-semibold mb-2">Elevated Card</h3>
        <p className="text-gray-600">This card has a shadow and elevated appearance.</p>
      </CardBody>
    </Card>
  ),
}

export const Outlined: Story = {
  render: () => (
    <Card variant="outlined">
      <CardBody>
        <h3 className="text-lg font-semibold mb-2">Outlined Card</h3>
        <p className="text-gray-600">This card has an outlined border style.</p>
      </CardBody>
    </Card>
  ),
}

export const Glass: Story = {
  render: () => (
    <Card variant="glass">
      <CardBody>
        <h3 className="text-lg font-semibold mb-2 text-white">Glass Card</h3>
        <p className="text-white/80">This card has a glass morphism effect with backdrop blur.</p>
      </CardBody>
    </Card>
  ),
}

export const Neon: Story = {
  render: () => (
    <Card variant="neon">
      <CardBody>
        <h3 className="text-lg font-semibold mb-2 text-cyan-400">Neon Card</h3>
        <p className="text-cyan-400/80">This card has a neon glow effect.</p>
      </CardBody>
    </Card>
  ),
}

export const Gaming: Story = {
  render: () => (
    <Card variant="gaming">
      <CardBody>
        <h3 className="text-lg font-bold mb-2 text-white uppercase tracking-wider">Gaming Card</h3>
        <p className="text-white/80">This card has a gaming theme with gradient background.</p>
      </CardBody>
    </Card>
  ),
}

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 max-w-2xl">
      <Card size="sm">
        <CardBody>
          <h4 className="font-semibold mb-1">Small Card</h4>
          <p className="text-sm text-gray-600">Compact size card.</p>
        </CardBody>
      </Card>
      <Card size="md">
        <CardBody>
          <h4 className="font-semibold mb-2">Medium Card</h4>
          <p className="text-gray-600">Standard size card.</p>
        </CardBody>
      </Card>
      <Card size="lg">
        <CardBody>
          <h4 className="font-semibold mb-2">Large Card</h4>
          <p className="text-gray-600">Spacious size card.</p>
        </CardBody>
      </Card>
      <Card size="xl">
        <CardBody>
          <h4 className="font-semibold mb-2">Extra Large Card</h4>
          <p className="text-gray-600">Very spacious size card.</p>
        </CardBody>
      </Card>
    </div>
  ),
}

// Complete Card
export const Complete: Story = {
  render: () => (
    <Card variant="elevated">
      <CardHeader>
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            A
          </div>
          <div className="ml-3">
            <h3 className="font-semibold">Alex Johnson</h3>
            <p className="text-sm text-gray-500">Software Engineer</p>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <p className="text-gray-600 mb-4">
          This is a complete card example with header, body, and footer sections. 
          It demonstrates how to structure a card with multiple components.
        </p>
        <div className="flex gap-2">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">React</span>
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">TypeScript</span>
          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Design</span>
        </div>
      </CardBody>
      <CardFooter>
        <div className="flex justify-between items-center w-full">
          <span className="text-sm text-gray-500">Last updated 2 hours ago</span>
          <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
            View Profile
          </button>
        </div>
      </CardFooter>
    </Card>
  ),
}

// Interactive Cards
export const Interactive: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card variant="elevated" animation={{ whileHover: { y: -5 } }}>
        <CardBody>
          <h3 className="font-semibold mb-2">Hover Up</h3>
          <p className="text-gray-600">This card moves up on hover.</p>
        </CardBody>
      </Card>
      <Card variant="glass" animation={{ whileHover: { scale: 1.02 } }}>
        <CardBody>
          <h3 className="font-semibold mb-2 text-white">Scale on Hover</h3>
          <p className="text-white/80">This card scales on hover.</p>
        </CardBody>
      </Card>
      <Card variant="neon" animation={{ whileHover: { rotate: 1 } }}>
        <CardBody>
          <h3 className="font-semibold mb-2 text-cyan-400">Rotate on Hover</h3>
          <p className="text-cyan-400/80">This card rotates on hover.</p>
        </CardBody>
      </Card>
    </div>
  ),
}

// Gaming Cards
export const GamingCards: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card variant="gaming">
        <CardHeader>
          <h3 className="text-xl font-bold text-white uppercase tracking-wider">🎮 Achievement Unlocked</h3>
        </CardHeader>
        <CardBody>
          <p className="text-white/80 mb-4">You've completed the first level! Ready for the next challenge?</p>
          <div className="flex items-center justify-between">
            <span className="text-yellow-400 font-bold">+100 XP</span>
            <span className="text-white/60 text-sm">Level 1</span>
          </div>
        </CardBody>
      </Card>
      <Card variant="gaming">
        <CardHeader>
          <h3 className="text-xl font-bold text-white uppercase tracking-wider">⚡ Power-Up Available</h3>
        </CardHeader>
        <CardBody>
          <p className="text-white/80 mb-4">Double damage for 30 seconds! Use it wisely.</p>
          <div className="flex items-center justify-between">
            <span className="text-orange-400 font-bold">Special</span>
            <span className="text-white/60 text-sm">1 remaining</span>
          </div>
        </CardBody>
      </Card>
    </div>
  ),
}
