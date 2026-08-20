"use client";

type ArchiveAssessmentButtonProps = {
  assessmentName: string;
};

export function ArchiveAssessmentButton({
  assessmentName,
}: ArchiveAssessmentButtonProps) {
  function handleClick(
    event: React.MouseEvent<HTMLButtonElement>,
  ) {
    const confirmed = window.confirm(
      `Archive "${assessmentName}"?\n\nThis assessment will remain available for historical results and reporting, but it will no longer be treated as the client's current Data Health baseline.`,
    );

    if (!confirmed) {
      event.preventDefault();
    }
  }

  return (
    <button
      type="submit"
      onClick={handleClick}
      className="rounded-lg border border-amber-300 px-5 py-2.5 text-sm font-medium text-amber-700 hover:bg-amber-50"
    >
      Archive
    </button>
  );
}