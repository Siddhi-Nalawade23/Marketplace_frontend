// src/App.test.jsx
import { it, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';
import { describe } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

describe("App", () => {
  it("renders functions", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

  })
})