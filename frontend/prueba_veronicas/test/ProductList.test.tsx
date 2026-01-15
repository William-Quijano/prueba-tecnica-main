import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductList from "@/components/product-list";
import { useProductList } from "@/hooks/use-product-list";

// --- Mocks ---

// Mocking the custom hook fully to control state
jest.mock("@/hooks/use-product-list");

// Mock child components that are not the focus of this unit test
// This makes the test about ProductList's logic (layout, dialogs, orchestration)
// rather than re-testing ProductGrid logic.
jest.mock("@/components/product-grid", () => ({
  ProductGrid: ({ data, onEdit }: any) => (
    <div data-testid="product-grid">
      {data.map((p: any) => (
        <button key={p.id} onClick={() => onEdit(p)}>
          Edit {p.name}
        </button>
      ))}
    </div>
  ),
}));

// Mock ProductForm inside the dialog
jest.mock("@/components/product-form", () => ({
  ProductForm: ({ onSuccess }: any) => (
    <div data-testid="product-form">
      Mock Product Form
      <button onClick={onSuccess}>Trigger Success</button>
    </div>
  ),
}));

// Mock UI components if strictly needed, but `Dialog` behavior is complex so we might rely on a simple mock if the real one is troublesome.
// However, Radix UI (Dialog) works well with RTL typically.
// We will test the integration with the real UI primitives.

describe("ProductList", () => {
  const user = userEvent.setup();
  const mockUseProductList = useProductList as jest.Mock;

  // Default hook return values
  const defaultHookValues = {
    t: (key: string) => key,
    tForm: (key: string) => key,
    search: "",
    handleSearch: jest.fn(),
    isCreateOpen: false,
    setIsCreateOpen: jest.fn(),
    editingId: null,
    setEditingId: jest.fn(),
    fetchNextPage: jest.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
    status: "success",
    refetch: jest.fn(),
    products: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseProductList.mockReturnValue(defaultHookValues);
  });

  it("should render search input and add button", () => {
    mockUseProductList.mockReturnValue({
      ...defaultHookValues,
      t: (key: string) => (key === "searchPlaceholder" ? "Buscar..." : key === "addProduct" ? "Agregar" : key),
    });

    render(<ProductList />);

    expect(screen.getByPlaceholderText("Buscar...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Agregar/i })).toBeInTheDocument();
  });

  it("should handle search input interaction", async () => {
    const handleSearchMock = jest.fn();
    mockUseProductList.mockReturnValue({
      ...defaultHookValues,
      handleSearch: handleSearchMock,
    });

    render(<ProductList />);

    const input = screen.getByPlaceholderText("searchPlaceholder");
    await user.type(input, "Test");

    expect(handleSearchMock).toHaveBeenCalled();
  });

  it("should open create dialog when add button is clicked", async () => {
    // We need to simulate that clicking the button will eventually trigger setIsCreateOpen(true)
    // But since `isCreateOpen` comes from the hook, we must verify the setter is called.
    // However, the *rendering* of the dialog content depends on `isCreateOpen` being true.
    // So to test the *opening*, we can check that `setIsCreateOpen` was called.
    // OR we can mock the state change sequence.
    
    // Test approach 1: Verify hook interaction
    const setIsCreateOpenMock = jest.fn();
    mockUseProductList.mockReturnValue({
        ...defaultHookValues,
        setIsCreateOpen: setIsCreateOpenMock,
        isCreateOpen: false // Dialog closed initially
    });

    render(<ProductList />);
    
    const addBtn = screen.getByRole("button", { name: /addProduct/i });
    await user.click(addBtn);

    // Specifically checks that we clicked the Trigger which calls the setter
    // Note: Radix UI dialog trigger automatically handles some state, but our component 
    // controls `open={isCreateOpen}` and `onOpenChange={setIsCreateOpen}`.
    // So clicking the trigger should fire onOpenChange(true).
    await waitFor(() => {
        expect(setIsCreateOpenMock).toHaveBeenCalledWith(true);
    });
  });

  it("should render ProductForm inside create dialog when open", () => {
    mockUseProductList.mockReturnValue({
      ...defaultHookValues,
      isCreateOpen: true, // Force open
    });

    render(<ProductList />);

    // Since Radix Dialog portals to body, we look for content globally
    expect(screen.getByTestId("product-form")).toBeInTheDocument();
    expect(screen.getAllByText("createTitle")[0]).toBeInTheDocument();
  });

  it("should open edit dialog when an item is selected for editing", () => {
    mockUseProductList.mockReturnValue({
      ...defaultHookValues,
      editingId: "123", // Force edit state
    });

    render(<ProductList />);

    expect(screen.getByTestId("product-form")).toBeInTheDocument();
    expect(screen.getAllByText("editTitle")[0]).toBeInTheDocument();
  });

  it("should handle edit click from grid", async () => {
    const setEditingIdMock = jest.fn();
    const mockProducts = [{ id: "101", name: "Item 1" }];

    mockUseProductList.mockReturnValue({
      ...defaultHookValues,
      products: mockProducts,
      setEditingId: setEditingIdMock,
    });

    render(<ProductList />);

    // Click the "Edit Item 1" button rendered by our Grid Mock
    const editBtn = screen.getByText("Edit Item 1");
    await user.click(editBtn);

    expect(setEditingIdMock).toHaveBeenCalledWith("101");
  });

  it("should call refetch when form succeeds", async () => {
    const setIsCreateOpenMock = jest.fn();
    const refetchMock = jest.fn();

    mockUseProductList.mockReturnValue({
      ...defaultHookValues,
      isCreateOpen: true,
      setIsCreateOpen: setIsCreateOpenMock,
      refetch: refetchMock,
    });

    render(<ProductList />);

    // Trigger success in the mock form
    const successBtn = screen.getByText("Trigger Success");
    await user.click(successBtn);

    expect(setIsCreateOpenMock).toHaveBeenCalledWith(false);
    expect(refetchMock).toHaveBeenCalled();
  });
});
