/// <reference types="vitest/globals" />
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { KifuBoard } from '../ts/components/KifuBoard';
import { KifuLoader } from '../ts/components/KifuLoader';

// Mock child components
vi.mock('../ts/components/BoardView', () => ({
    BoardView: vi.fn(() => <div data-testid="BoardView" />),
}));
vi.mock('../ts/components/BoardControl', () => ({
    BoardControl: vi.fn(({ text, controlIndex, onPreviouse, onNext, onRotate }) => (
        <button
            data-testid={`BoardControl-${controlIndex}`}
            onClick={() => {
                if (controlIndex === 0) onPreviouse();
                if (controlIndex === 1) onRotate();
                if (controlIndex === 2) onNext();
            }}
        >
            {text}
        </button>
    )),
}));

describe('KifuBoard', () => {
    // Mock KifuLoader
    const mockKifuLoader = {
        getBoard: vi.fn(() => [['initial board']]),
        getPieceSente: vi.fn(() => ({})),
        getPieceGote: vi.fn(() => ({})),
        getStatus: vi.fn(() => 'initial status'),
        movePiece: vi.fn(),
    };

    it('renders BoardView and BoardControl components', () => {
        render(<KifuBoard loader={mockKifuLoader as unknown as KifuLoader} />);

        expect(screen.getByTestId('BoardView')).toBeInTheDocument();
        expect(screen.getByTestId('BoardControl-0')).toBeInTheDocument();
        expect(screen.getByTestId('BoardControl-1')).toBeInTheDocument();
        expect(screen.getByTestId('BoardControl-2')).toBeInTheDocument();
    });

    it('initializes state from KifuLoader and passes to BoardView', () => {
        render(<KifuBoard loader={mockKifuLoader as unknown as KifuLoader} />);

        // Verify initial calls to KifuLoader methods
        expect(mockKifuLoader.getBoard).toHaveBeenCalled();
        expect(mockKifuLoader.getPieceSente).toHaveBeenCalled();
        expect(mockKifuLoader.getPieceGote).toHaveBeenCalled();
        expect(mockKifuLoader.getStatus).toHaveBeenCalled();

        // Since BoardView is mocked, we can't directly check props passed to it
        // but we can infer if the data was fetched correctly by KifuBoard
        // and would have been passed if BoardView was not mocked.
    });

    it('calls movePiece with -1 when "戻る" (Previous) button is clicked', async () => {
        render(<KifuBoard loader={mockKifuLoader as unknown as KifuLoader} />);
        const prevButton = screen.getByTestId('BoardControl-0');

        // Simulate new state after movePiece(-1)
        mockKifuLoader.getBoard.mockReturnValueOnce([['previous board']]);
        mockKifuLoader.getStatus.mockReturnValueOnce('previous status');

        fireEvent.click(prevButton);

        await waitFor(() => {
            expect(mockKifuLoader.movePiece).toHaveBeenCalledWith(-1);
            // In a real test with unmocked BoardView, we would assert BoardView props changed
            // Here we check if the loader was called to update state
        });
    });

    it('calls movePiece with 1 when "進む" (Next) button is clicked', async () => {
        render(<KifuBoard loader={mockKifuLoader as unknown as KifuLoader} />);
        const nextButton = screen.getByTestId('BoardControl-2');

        // Simulate new state after movePiece(1)
        mockKifuLoader.getBoard.mockReturnValueOnce([['next board']]);
        mockKifuLoader.getStatus.mockReturnValueOnce('next status');

        fireEvent.click(nextButton);

        await waitFor(() => {
            expect(mockKifuLoader.movePiece).toHaveBeenCalledWith(1);
        });
    });

    it('calls rotate method when "盤面反転" (Rotate) button is clicked', () => {
        // For 'rotate', the original component logs to console and doesn't affect state.
        // We'll mock console.log to confirm it's called if needed, or rely on its current empty implementation.
        // For now, we'll just check if the mock button handler was called.
        render(<KifuBoard loader={mockKifuLoader as unknown as KifuLoader} />);
        const rotateButton = screen.getByTestId('BoardControl-1');

        // Spy on console.log if you want to test the console output.
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

        fireEvent.click(rotateButton);

        expect(consoleSpy).toHaveBeenCalledWith('rotate');
        consoleSpy.mockRestore();
    });
});
