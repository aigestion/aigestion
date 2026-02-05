import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Design System/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'accent', 'outline', 'ghost', 'link', 'success', 'warning', 'error', 'info', 'gaming', 'neon'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    loading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    fullWidth: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Default
export const Default: Story = {
  args: {
    children: 'Button',
  },
}

// Variants
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
}

export const Accent: Story = {
  args: {
    variant: 'accent',
    children: 'Accent Button',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button',
  },
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
}

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Success Button',
  },
}

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Warning Button',
  },
}

export const Error: Story = {
  args: {
    variant: 'error',
    children: 'Error Button',
  },
}

export const Info: Story = {
  args: {
    variant: 'info',
    children: 'Info Button',
  },
}

export const Gaming: Story = {
  args: {
    variant: 'gaming',
    children: '🎮 Gaming Button',
  },
}

export const Neon: Story = {
  args: {
    variant: 'neon',
    children: '🔮 Neon Button',
  },
}

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
    </div>
  ),
}

// States
export const States: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button>Normal</Button>
      <Button loading>Loading</Button>
      <Button disabled>Disabled</Button>
    </div>
  ),
}

// With Icons
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button leftIcon={<span>🚀</span>}>Left Icon</Button>
      <Button rightIcon={<span>⭐</span>}>Right Icon</Button>
      <Button leftIcon={<span>🎮</span>} rightIcon={<span>🏆</span>}>
        Both Icons
      </Button>
    </div>
  ),
}

// Full Width
export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: 'Full Width Button',
  },
}

// Link Button
export const LinkButton: Story = {
  args: {
    variant: 'link',
    href: '#',
    children: 'Link Button',
  },
}

// Interactive
export const Interactive: Story = {
  render: () => (
    <div className="space-y-4">
      <Button 
        variant="primary" 
        animation={{ whileHover: { scale: 1.1 } }}
      >
        Hover Me
      </Button>
      <Button 
        variant="gaming"
        animation={{ whileTap: { scale: 0.95 } }}
      >
        Press Me
      </Button>
      <Button 
        variant="neon"
        animation={{ 
          whileHover: { 
            scale: 1.05,
            boxShadow: '0 0 30px rgb(6 182 212 / 0.8)'
          } 
        }}
      >
        Glow Effect
      </Button>
    </div>
  ),
}
