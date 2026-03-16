/// <reference types="vitest/globals" />
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BoardView } from '../ts/components/BoardView';
import { Translater } from '../ts/components/Translater';

// Mock child components
vi.mock('../ts/components/RectItem', () => ({
    RectItem: vi.fn(({ x, y, piece, isGote }) => (
        <g data-testid={`RectItem-${x}-${y}`} data-piece={piece} data-isgote={isGote ? 'true' : 'false'} />
    )),
}));

vi.mock('../ts/components/NumberItem', () => ({
    NumberItem: vi.fn(({ counter }) => (
        <g data-testid={`NumberItem-${counter}`} />
    )),
}));


describe('BoardView', () => {
    const mockBoards = [
        ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
        ['-', 'HI', '-', '-', '-', '-', '-', 'KA', '-'],
        ['FU', 'FU', 'FU', 'FU', 'FU', 'FU', 'FU', 'FU', 'FU'],
        ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
        ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
        ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
        ['+FU', '+FU', '+FU', '+FU', '+FU', '+FU', '+FU', '+FU', '+FU'],
        ['-', '+KA', '-', '-', '-', '-', '-', '+HI', '-'],
        ['+', '+', '+', '+', '+', '+', '+', '+', '+'],
    ];

    const mockPieceSente = { FU: 2, KI: 1 };
    const mockPieceGote = { KA: 1 };
    const mockStatus = 'TORYO';

    it('renders correctly with given props', () => {
        render(
            <BoardView
                boards={mockBoards as any}
                pieceSente={mockPieceSente}
                pieceGote={mockPieceGote}
                status={mockStatus}
            />
        );

        // Check if RectItems are rendered
        expect(screen.getAllByTestId(/RectItem-\d-\d/)).toHaveLength(mockBoards.flat().length);

        // Check if NumberItems are rendered (9 for rows/cols)
        expect(screen.getAllByTestId(/NumberItem-\d/)).toHaveLength(9);

        // Check captured pieces text
        expect(screen.getByText(/先手持ち駒/).textContent).toBe('先手持ち駒 歩2 金1 ');
        expect(screen.getByText(/後手持ち駒/).textContent).toBe('後手持ち駒 角1 ');

        // Check status text
        expect(screen.getByText('投了')).toBeInTheDocument();
    });

    it('renders empty captured pieces when counts are zero', () => {
        render(
            <BoardView
                boards={mockBoards as any}
                pieceSente={{}}
                pieceGote={{}}
                status={mockStatus}
            />
        );

        expect(screen.getByText(/先手持ち駒/).textContent).toBe('先手持ち駒 ');
        expect(screen.getByText(/後手持ち駒/).textContent).toBe('後手持ち駒 ');
    });
});
