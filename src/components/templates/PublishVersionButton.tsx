"use client";

type PublishVersionButtonProps = {
  versionLabel: string;
};

export function PublishVersionButton({
  versionLabel,
}: PublishVersionButtonProps) {
  function handleClick(
    event: React.MouseEvent<HTMLButtonElement>,
  ) {
    const confirmed = window.confirm(
      `Publish Version ${versionLabel}?\n\nOnce published, this version will become read-only.`,
    );

    if (!confirmed) {
      event.preventDefault();
    }
  }

  return (
    <button
      type="submit"
      onClick={handleClick}
      className="rounded-lg border border-brand-purple px-4 py-2 text-sm font-semibold text-brand-purple hover:bg-brand-blue-light"
    >
      Publish Version
    </button>
  );
}