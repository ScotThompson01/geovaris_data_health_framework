"use client";

type DeleteClientButtonProps = {
  clientName: string;
};

export function DeleteClientButton({
  clientName,
}: DeleteClientButtonProps) {
  function handleClick(
    event: React.MouseEvent<HTMLButtonElement>,
  ) {
    const confirmed = window.confirm(
      `Delete "${clientName}"?\n\nThis client will be permanently deleted. This action cannot be undone.`,
    );

    if (!confirmed) {
      event.preventDefault();
    }
  }

  return (
    <button
      type="submit"
      onClick={handleClick}
      className="rounded-lg border border-red-300 px-5 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50"
    >
      Delete Client
    </button>
  );
}