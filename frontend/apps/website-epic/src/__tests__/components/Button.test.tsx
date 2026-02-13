import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../../components/ui/Button';

describe('Button Component', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-blue-600', 'text-white');
  });

  it('renders with different variants', () => {
    const { rerender } = render(<Button variant="secondary">Secondary</Button>);

    let button = screen.getByRole('button', { name: 'Secondary' });
    expect(button).toHaveClass('bg-gray-600');

    rerender(<Button variant="outline">Outline</Button>);
    button = screen.getByRole('button', { name: 'Outline' });
    expect(button).toHaveClass('border', 'border-gray-300');

    rerender(<Button variant="ghost">Ghost</Button>);
    button = screen.getByRole('button', { name: 'Ghost' });
    expect(button).toHaveClass('text-gray-700');

    rerender(<Button variant="destructive">Destructive</Button>);
    button = screen.getByRole('button', { name: 'Destructive' });
    expect(button).toHaveClass('bg-red-600');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);

    let button = screen.getByRole('button', { name: 'Small' });
    expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm');

    rerender(<Button size="md">Medium</Button>);
    button = screen.getByRole('button', { name: 'Medium' });
    expect(button).toHaveClass('px-4', 'py-2', 'text-base');

    rerender(<Button size="lg">Large</Button>);
    button = screen.getByRole('button', { name: 'Large' });
    expect(button).toHaveClass('px-6', 'py-3', 'text-lg');

    rerender(<Button size="xl">Extra Large</Button>);
    button = screen.getByRole('button', { name: 'Extra Large' });
    expect(button).toHaveClass('px-8', 'py-4', 'text-xl');
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole('button', { name: 'Click me' });
    await fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Disabled' });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>);

    const button = screen.getByRole('button', { name: 'Loading' });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');

    // Check for loading spinner
    const spinner = button.querySelector('svg');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('animate-spin');
  });

  it('renders with icon on the left', () => {
    render(<Button icon={<span data-testid="icon">🚀</span>}>With Icon</Button>);

    const button = screen.getByRole('button', { name: 'With Icon' });
    const icon = button.querySelector('[data-testid="icon"]');

    expect(icon).toBeInTheDocument();
    expect(button).toContainHTML('🚀');
  });

  it('renders with icon on the right', () => {
    render(
      <Button icon={<span data-testid="icon">🚀</span>} iconPosition="right">
        With Icon
      </Button>
    );

    const button = screen.getByRole('button', { name: 'With Icon' });
    const icon = button.querySelector('[data-testid="icon"]');

    expect(icon).toBeInTheDocument();
    expect(button).toContainHTML('🚀');
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>);

    const button = screen.getByRole('button', { name: 'Custom' });
    expect(button).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(<Button ref={ref as any}>Ref Button</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('has proper accessibility attributes', () => {
    render(<Button aria-label="Custom label">Button</Button>);

    const button = screen.getByRole('button', { name: 'Custom label' });
    expect(button).toHaveAttribute('aria-label', 'Custom label');
  });

  it('handles keyboard events', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Button</Button>);

    const button = screen.getByRole('button', { name: 'Button' });

    // Test Enter key
    button.focus();
    await fireEvent.keyDown(button, { key: 'Enter' });
    expect(handleClick).toHaveBeenCalledTimes(1);

    // Test Space key
    await fireEvent.keyDown(button, { key: ' ' });
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it('prevents click when disabled', async () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Disabled' });
    await fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies hover states', () => {
    render(<Button variant="primary">Hover me</Button>);

    const button = screen.getByRole('button', { name: 'Hover me' });
    expect(button).toHaveClass('hover:bg-blue-700');
  });

  it('applies focus states', () => {
    render(<Button>Focus me</Button>);

    const button = screen.getByRole('button', { name: 'Focus me' });
    expect(button).toHaveClass('focus:ring-blue-500');
  });

  it('handles different button types', () => {
    render(<Button type="submit">Submit</Button>);

    const button = screen.getByRole('button', { name: 'Submit' });
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('renders as different HTML element when as prop is provided', () => {
    render(
      <Button as="a" href="/test">
        Link
      </Button>
    );

    const link = screen.getByRole('link', { name: 'Link' });
    expect(link).toHaveAttribute('href', '/test');
  });
});
