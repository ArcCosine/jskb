/// <reference types="vitest/globals" />
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NumberItem } from '../ts/components/NumberItem';
import { Translater } from '../ts/components/Translater';

// Mock Translater utility
vi.mock('../ts/components/Translater', () => {
    const mockMethods = {
        numberToFullWidth: vi.fn(num => `FullWidth(${num})`),
        numberToCharactor: vi.fn(num => `Charactor(${num})`),
    };
    return {
        Translater: vi.fn().mockImplementation(function() {
            return mockMethods;
        }),
    };
});

describe('NumberItem', () => {
    it('renders correctly with given counter prop', () => {
        const mockCounter = 5;
        render(<NumberItem counter={mockCounter} />);

        // Verify Translater mock calls
        const translaterInstance = (Translater as any).mock.results[0].value;
        expect(translaterInstance.numberToFullWidth).toHaveBeenCalledWith(mockCounter);
        expect(translaterInstance.numberToCharactor).toHaveBeenCalledWith(mockCounter);

        // Check if the formatted text is rendered
        expect(screen.getByText(`FullWidth(${mockCounter})`)).toBeInTheDocument();
        expect(screen.getByText(`Charactor(${mockCounter})`)).toBeInTheDocument();

        // Check if the text elements have the correct class
        expect(screen.getByText(`FullWidth(${mockCounter})`).closest('text')).toHaveClass('piece');
        expect(screen.getByText(`Charactor(${mockCounter})`).closest('text')).toHaveClass('piece');
    });

    it('renders different numbers correctly', () => {
        const mockCounter = 9;
        render(<NumberItem counter={mockCounter} />);

        const translaterInstance = (Translater as any).mock.results[1].value;
        expect(translaterInstance.numberToFullWidth).toHaveBeenCalledWith(mockCounter);
        expect(translaterInstance.numberToCharactor).toHaveBeenCalledWith(mockCounter);

        expect(screen.getByText(`FullWidth(${mockCounter})`)).toBeInTheDocument();
        expect(screen.getByText(`Charactor(${mockCounter})`)).toBeInTheDocument();
    });
});
