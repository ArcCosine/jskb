/// <reference types="vitest/globals" />
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BoardControl } from '../ts/components/BoardControl';

describe('BoardControl', () => {
    it('calls onPreviouse when controlIndex is 0 and button is clicked', () => {
        const onPreviouseMock = vi.fn();
        const onNextMock = vi.fn();
        const onRotateMock = vi.fn();

        render(
            <BoardControl
                text="Previous"
                controlIndex={0}
                onPreviouse={onPreviouseMock}
                onNext={onNextMock}
                onRotate={onRotateMock}
            />
        );

        fireEvent.click(screen.getByText('Previous'));

        expect(onPreviouseMock).toHaveBeenCalledTimes(1);
        expect(onNextMock).not.toHaveBeenCalled();
        expect(onRotateMock).not.toHaveBeenCalled();
    });

    it('calls onRotate when controlIndex is 1 and button is clicked', () => {
        const onPreviouseMock = vi.fn();
        const onNextMock = vi.fn();
        const onRotateMock = vi.fn();

        render(
            <BoardControl
                text="Rotate"
                controlIndex={1}
                onPreviouse={onPreviouseMock}
                onNext={onNextMock}
                onRotate={onRotateMock}
            />
        );

        fireEvent.click(screen.getByText('Rotate'));

        expect(onRotateMock).toHaveBeenCalledTimes(1);
        expect(onPreviouseMock).not.toHaveBeenCalled();
        expect(onNextMock).not.toHaveBeenCalled();
    });

    it('calls onNext when controlIndex is 2 and button is clicked', () => {
        const onPreviouseMock = vi.fn();
        const onNextMock = vi.fn();
        const onRotateMock = vi.fn();

        render(
            <BoardControl
                text="Next"
                controlIndex={2}
                onPreviouse={onPreviouseMock}
                onNext={onNextMock}
                onRotate={onRotateMock}
            />
        );

        fireEvent.click(screen.getByText('Next'));

        expect(onNextMock).toHaveBeenCalledTimes(1);
        expect(onPreviouseMock).not.toHaveBeenCalled();
        expect(onRotateMock).not.toHaveBeenCalled();
    });

    it('does nothing when controlIndex is not 0, 1, or 2 and button is clicked', () => {
        const onPreviouseMock = vi.fn();
        const onNextMock = vi.fn();
        const onRotateMock = vi.fn();

        render(
            <BoardControl
                text="Invalid"
                controlIndex={99}
                onPreviouse={onPreviouseMock}
                onNext={onNextMock}
                onRotate={onRotateMock}
            />
        );

        fireEvent.click(screen.getByText('Invalid'));

        expect(onPreviouseMock).not.toHaveBeenCalled();
        expect(onNextMock).not.toHaveBeenCalled();
        expect(onRotateMock).not.toHaveBeenCalled();
    });
});
