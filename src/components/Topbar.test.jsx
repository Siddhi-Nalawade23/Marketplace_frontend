import React from "react";
import Topbar from "./Topbar";
import "@testing-library/jest-dom/vitest"
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";

describe("Topbar", () => {

    it("should render the topbar", () => {
        render(
            <MemoryRouter>
                <Topbar />
            </MemoryRouter>
        );
        const topbar = screen.getByRole("banner");
        expect(topbar).toBeInTheDocument();
    })
    

})
