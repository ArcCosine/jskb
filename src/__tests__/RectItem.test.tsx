/// <reference types="vitest/globals" />
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RectItem } from '../ts/components/RectItem';

describe('RectItem', () => {
    const baseSize = 60;

    it('renders correctly for a normal piece (not Gote)', () => {
        const props = { x: 1, y: 2, piece: '歩', isGote: false };
        const { container } = render(<RectItem {...props} />);

        const rectElement = container.querySelector('rect');
        const textElement = screen.getByText(props.piece);

        expect(rectElement).toBeInTheDocument();
        expect(rectElement).toHaveAttribute('x', String(props.x * baseSize + 6));
        expect(rectElement).toHaveAttribute('y', String(props.y * baseSize + 60));
        expect(rectElement).toHaveAttribute('width', String(baseSize));
        expect(rectElement).toHaveAttribute('height', String(baseSize));
        expect(rectElement).toHaveAttribute('stroke', 'black');
        expect(rectElement).toHaveAttribute('fill', 'transparent');
        expect(rectElement).toHaveAttribute('stroke-width', '1');

        expect(textElement).toBeInTheDocument();
        expect(textElement).toHaveAttribute('x', String(props.x * baseSize + 22));
        expect(textElement).toHaveAttribute('y', String(props.y * baseSize + 102));
        expect(textElement).toHaveAttribute('transform', ''); // No transform for not Gote
        expect(textElement).toHaveClass('piece');
    });

    it('renders correctly for a Gote piece', () => {
        const props = { x: 3, y: 4, piece: '香', isGote: true };
        const { container } = render(<RectItem {...props} />);

        const rectElement = container.querySelector('rect');
        const textElement = screen.getByText(props.piece);

        expect(rectElement).toBeInTheDocument();
        expect(textElement).toBeInTheDocument();
        expect(textElement).toHaveAttribute('x', String(props.x * baseSize + 22));
        expect(textElement).toHaveAttribute('y', String(props.y * baseSize + 102));

        const expectedRotate = `matrix(-1, 0, 0, -1, ${(2 * props.x + 1) * baseSize + 9}, ${(2 * props.y + 1) * baseSize + 124})`;
        expect(textElement).toHaveAttribute('transform', expectedRotate);
        expect(textElement).toHaveClass('piece');
    });

    it('renders with different piece values', () => {
        const props = { x: 5, y: 6, piece: '金', isGote: false };
        render(<RectItem {...props} />);
        expect(screen.getByText('金')).toBeInTheDocument();
    });
});
