import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import AddressModal from "./AddressModal";
import { INDIAN_STATES } from "../data/indianStates";

describe("AddressModal", () => {
    let onClose;
    let onConfirm;

    beforeEach(() => {
        onClose = vi.fn();
        onConfirm = vi.fn();
    });

    it("renders shipping details form", () => {
        render(
            <AddressModal
                onClose={onClose}
                onConfirm={onConfirm}
            />
        );

        expect(
            screen.getByRole("heading", { name: "Shipping Details" })
        ).toBeInTheDocument();

        expect(
            screen.getByText("Where should we send your order?")
        ).toBeInTheDocument();

        expect(screen.getByLabelText("Full Name")).toBeInTheDocument();
        expect(screen.getByLabelText("Phone Number")).toBeInTheDocument();
        expect(screen.getByLabelText("Address")).toBeInTheDocument();
        expect(screen.getByLabelText("City")).toBeInTheDocument();
        expect(screen.getByLabelText("Pincode")).toBeInTheDocument();
        expect(screen.getByLabelText("State")).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: "Cancel" })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: "Confirm" })
        ).toBeInTheDocument();
    });

    it("updates form fields when user enters details", async () => {
        const user = userEvent.setup();

        render(
            <AddressModal
                onClose={onClose}
                onConfirm={onConfirm}
            />
        );

        const nameInput = screen.getByLabelText("Full Name");
        const phoneInput = screen.getByLabelText("Phone Number");
        const addressInput = screen.getByLabelText("Address");
        const cityInput = screen.getByLabelText("City");
        const pincodeInput = screen.getByLabelText("Pincode");
        const stateSelect = screen.getByLabelText("State");

        await user.type(nameInput, "Priya Sharma");
        await user.type(phoneInput, "9876543210");
        await user.type(addressInput, "House 10, MG Road");
        await user.type(cityInput, "Pune");
        await user.type(pincodeInput, "411001");
        await user.selectOptions(stateSelect, "Maharashtra");

        expect(nameInput).toHaveValue("Priya Sharma");
        expect(phoneInput).toHaveValue("9876543210");
        expect(addressInput).toHaveValue("House 10, MG Road");
        expect(cityInput).toHaveValue("Pune");
        expect(pincodeInput).toHaveValue("411001");
        expect(stateSelect).toHaveValue("Maharashtra");
    });

    it("shows validation errors when form is submitted empty", async () => {
        const user = userEvent.setup();

        render(
            <AddressModal
                onClose={onClose}
                onConfirm={onConfirm}
            />
        );

        await user.click(
            screen.getByRole("button", { name: "Confirm" })
        );

        expect(screen.getByText("Name is required")).toBeInTheDocument();
        expect(
            screen.getByText("Enter a valid 10-digit mobile number")
        ).toBeInTheDocument();
        expect(
            screen.getByText("Address is required")
        ).toBeInTheDocument();
        expect(
            screen.getByText("City is required")
        ).toBeInTheDocument();
        expect(
            screen.getByText("Select a state")
        ).toBeInTheDocument();
        expect(
            screen.getByText("Enter a valid 6-digit pincode")
        ).toBeInTheDocument();

        expect(onConfirm).not.toHaveBeenCalled();
    });

    it("shows error for invalid phone number", async () => {
        const user = userEvent.setup();

        render(
            <AddressModal
                onClose={onClose}
                onConfirm={onConfirm}
            />
        );

        await user.type(
            screen.getByLabelText("Phone Number"),
            "1234567890"
        );

        await user.click(
            screen.getByRole("button", { name: "Confirm" })
        );

        expect(
            screen.getByText("Enter a valid 10-digit mobile number")
        ).toBeInTheDocument();

        expect(onConfirm).not.toHaveBeenCalled();
    });

    it("shows error for invalid pincode", async () => {
        const user = userEvent.setup();

        render(
            <AddressModal
                onClose={onClose}
                onConfirm={onConfirm}
            />
        );

        await user.type(
            screen.getByLabelText("Pincode"),
            "12345"
        );

        await user.click(
            screen.getByRole("button", { name: "Confirm" })
        );

        expect(
            screen.getByText("Enter a valid 6-digit pincode")
        ).toBeInTheDocument();

        expect(onConfirm).not.toHaveBeenCalled();
    });

    it("shows all Indian states in the state dropdown", () => {
        render(
            <AddressModal
                onClose={onClose}
                onConfirm={onConfirm}
            />
        );

        const stateSelect = screen.getByLabelText("State");

        INDIAN_STATES.forEach((state) => {
            expect(
                screen.getByRole("option", { name: state })
            ).toBeInTheDocument();
        });

        expect(stateSelect).toHaveValue("");
    });

    it("calls onClose when Cancel is clicked", async () => {
        const user = userEvent.setup();

        render(
            <AddressModal
                onClose={onClose}
                onConfirm={onConfirm}
            />
        );

        await user.click(
            screen.getByRole("button", { name: "Cancel" })
        );

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when overlay is clicked", async () => {
        const user = userEvent.setup();

        const { container } = render(
            <AddressModal
                onClose={onClose}
                onConfirm={onConfirm}
            />
        );

        const overlay = container.querySelector(
            ".address-modal__overlay"
        );

        await user.click(overlay);

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("does not close when modal content is clicked", async () => {
        const user = userEvent.setup();

        const { container } = render(
            <AddressModal
                onClose={onClose}
                onConfirm={onConfirm}
            />
        );

        const modal = container.querySelector(".address-modal");

        await user.click(modal);

        expect(onClose).not.toHaveBeenCalled();
    });

    it("calls onConfirm with form data when valid details are submitted", async () => {
        const user = userEvent.setup();

        render(
            <AddressModal
                onClose={onClose}
                onConfirm={onConfirm}
            />
        );

        await user.type(
            screen.getByLabelText("Full Name"),
            "Priya Sharma"
        );

        await user.type(
            screen.getByLabelText("Phone Number"),
            "9876543210"
        );

        await user.type(
            screen.getByLabelText("Address"),
            "House 10, MG Road"
        );

        await user.type(
            screen.getByLabelText("City"),
            "Pune"
        );

        await user.type(
            screen.getByLabelText("Pincode"),
            "411001"
        );

        await user.selectOptions(
            screen.getByLabelText("State"),
            "Maharashtra"
        );

        await user.click(
            screen.getByRole("button", { name: "Confirm" })
        );

        expect(onConfirm).toHaveBeenCalledTimes(1);

        expect(onConfirm).toHaveBeenCalledWith({
            shipping_name: "Priya Sharma",
            shipping_phone: "9876543210",
            shipping_address: "House 10, MG Road",
            shipping_city: "Pune",
            shipping_state: "Maharashtra",
            shipping_pincode: "411001",
        });
    });
});