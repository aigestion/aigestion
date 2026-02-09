import { ClassValue } from 'clsx';
import React from 'react';
import { HTMLMotionProps } from 'framer-motion';

declare function cn(...inputs: ClassValue[]): string;

declare const tokens: {
    readonly colors: {
        readonly primary: {
            readonly DEFAULT: "#8a2be2";
            readonly light: "#a052ee";
            readonly dark: "#711db1";
        };
        readonly secondary: {
            readonly DEFAULT: "#00d1ff";
            readonly light: "#33dbff";
            readonly dark: "#00a7cc";
        };
        readonly background: {
            readonly dark: "#0a0a0c";
            readonly panel: "#16161a";
            readonly light: "#f8fafc";
        };
        readonly accent: {
            readonly gold: "#ffb700";
            readonly neon: "#ccff00";
        };
        readonly status: {
            readonly success: "#10b981";
            readonly warning: "#f59e0b";
            readonly error: "#ef4444";
            readonly info: "#3b82f6";
        };
    };
    readonly spacing: {
        readonly xs: "0.25rem";
        readonly sm: "0.5rem";
        readonly md: "1rem";
        readonly lg: "1.5rem";
        readonly xl: "2rem";
        readonly '2xl': "3rem";
    };
    readonly typography: {
        readonly fontFamily: {
            readonly sans: "Inter, system-ui, sans-serif";
            readonly mono: "JetBrains Mono, monospace";
        };
        readonly fontSize: {
            readonly xs: "0.75rem";
            readonly sm: "0.875rem";
            readonly base: "1rem";
            readonly lg: "1.125rem";
            readonly xl: "1.25rem";
            readonly '2xl': "1.5rem";
            readonly '3xl': "1.875rem";
        };
    };
    readonly shadows: {
        readonly glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)";
        readonly glow: "0 0 15px rgba(138, 43, 226, 0.5)";
    };
};

interface ButtonProps extends Omit<HTMLMotionProps<"button">, 'children'> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    loading?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    children?: React.ReactNode;
}
declare const Button: React.ForwardRefExoticComponent<Omit<ButtonProps, "ref"> & React.RefAttributes<HTMLButtonElement>>;

interface CardProps extends HTMLMotionProps<"div"> {
    variant?: 'default' | 'glass' | 'accent' | 'outline';
    padding?: 'none' | 'sm' | 'md' | 'lg';
}
declare const Card: React.ForwardRefExoticComponent<Omit<CardProps, "ref"> & React.RefAttributes<HTMLDivElement>>;

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}
declare const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;

interface StatsCardProps extends Omit<CardProps, 'children'> {
    label: string;
    value: string | number;
    description?: string;
    trend?: {
        value: number;
        isUp: boolean;
    };
    icon?: React.ReactNode;
    color?: 'primary' | 'secondary' | 'accent' | 'success';
}
declare const StatsCard: ({ label, value, description, trend, icon, color, className, ...props }: StatsCardProps) => React.JSX.Element;

interface UserMenuProps {
    user: {
        name: string;
        email: string;
        avatar?: string;
    };
    onLogout?: () => void;
    onSettings?: () => void;
}
declare const UserMenu: ({ user, onLogout, onSettings }: UserMenuProps) => React.JSX.Element;

interface ChatBubbleProps {
    message: string;
    isAI?: boolean;
    timestamp?: string;
    className?: string;
}
declare const ChatBubble: ({ message, isAI, timestamp, className }: ChatBubbleProps) => React.JSX.Element;

interface FeedbackWidgetProps {
    onFeedback: (positive: boolean) => void;
    className?: string;
}
declare const FeedbackWidget: ({ onFeedback, className }: FeedbackWidgetProps) => React.JSX.Element;

interface OnboardingStep {
    id: string;
    title: string;
    content: string;
    aiComment: string;
}
interface AIOnboardingProps {
    steps: OnboardingStep[];
    onComplete?: () => void;
    className?: string;
}
declare const AIOnboarding: ({ steps, onComplete, className }: AIOnboardingProps) => React.JSX.Element | null;

export { AIOnboarding, type AIOnboardingProps, Button, type ButtonProps, Card, type CardProps, ChatBubble, type ChatBubbleProps, FeedbackWidget, type FeedbackWidgetProps, Input, type InputProps, type OnboardingStep, StatsCard, type StatsCardProps, UserMenu, type UserMenuProps, cn, tokens };
