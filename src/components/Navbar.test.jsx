import { render, screen, cleanup } from '@testing-library/react';
import Navbar from './Navbar';
import { getCurrentUser, isSeller, logout } from '../api/authHelpers';
import { useNavigate } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/vitest";

vi.mock('../api/authHelpers', () => ({
    getCurrentUser: vi.fn(),
    isSeller: vi.fn(),
    logout: vi.fn(),
}));


afterEach(() => {
    cleanup();
});
describe('Navbar', () => {

    it("render Home link", () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>

        );
        expect(
            screen.getByRole("link", { name: /home/i })
        ).toBeInTheDocument();
    });
    it("renders search link", () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );
        expect(
            screen.getByRole("link", { name: "Search", exact: true })
        ).toBeInTheDocument();
    });
    it("renders Products link", () => {
        isSeller.mockReturnValue(false);
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );
        expect(
            screen.getByRole("link", { name: "Products", exact: true })
        ).toBeInTheDocument();

    })

    it("render Add Products Role Seller", () => {
        isSeller.mockReturnValue(true);
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        expect(
            screen.getByRole("link", { name: "Add Product", extract: true })
        ).toBeInTheDocument();
    })
    it("Render order when role is not seller ",()=>{
         isSeller.mockReturnValue(false);
        render(
            <MemoryRouter>
                <Navbar/>
            </MemoryRouter>
        )
        expect(
            screen.getByRole("link",{name:"Orders",exact:true})
        ).toBeInTheDocument();
    })
     it("Render cart when role is not seller ",()=>{
         isSeller.mockReturnValue(false);
        render(
            <MemoryRouter>
                <Navbar/>
            </MemoryRouter>
        )
        expect(
            screen.getByRole("link",{name:"Cart",exact:true})
        ).toBeInTheDocument();
    })
     it("Render order when role is not seller ",()=>{
         isSeller.mockReturnValue(true);
        render(
            <MemoryRouter>
                <Navbar/>
            </MemoryRouter>
        )
        expect(
            screen.queryByRole("link",{name:"Cart",exact:true})
        ).not.toBeInTheDocument();
    })
    

});

