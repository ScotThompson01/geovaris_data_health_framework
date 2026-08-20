"use client";

type DeleteAssessmentButtonProps = {
  assessmentName: string;
};

export function DeleteAssessmentButton({
  assessmentName,
}: DeleteAssessmentButtonProps) {
  function handleClick(
    event: React.MouseEvent<HTMLButtonElement>,
  ) {
    const confirmed = window.confirm(
      `Delete "${assessmentName}"?\n\nThis draft assessment and its saved responses will be permanently deleted.`,
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
      Delete Draft
    </button>
  );
}