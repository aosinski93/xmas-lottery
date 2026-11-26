import { useDrawStep } from '../hooks/use-draw-step';

export const Draw = () => {
  const {
    wheelRef,
    copySuccess,
    handleCopy,
    result,
    hasCandidates,
  } = useDrawStep();

  return (
    <div
      className={
        'flex flex-col flex-auto items-center gap-4 bg-background-color-snow pt-6'
      }
    >
      <div ref={wheelRef} id="wheel" className="shadow-lg rounded-full z-30" />
      {!hasCandidates && !result && (
        <p className="z-20" role="status">
          Brak osób dostępnych do losowania.
        </p>
      )}
      {result && (
        <button
          type="button"
          className="flex items-center justify-between w-full px-4 cursor-pointer z-20"
          onClick={handleCopy}
        >
          <span
            className="w-full flex flex-col items-center justify-end gap-1 bg-white rounded-3xl p-6 border-2 border-santa-red-light"
          >
              <div className="flex justify-center items-center p-6 h-12 rounded-full bg-santa-blue text-sm font-extrabold text-black-enough">
                {result?.first_name}
              </div>
              <span className="text-sm text-black-enough font-semibold pb-2 pt-4">
                Propozycje prezentowe:
              </span>
              {result.gift_suggestions?.map((gift) => (
                <div
                  key={gift}
                  className="flex items-center justify-between text-sm text-black-enough"
                >
                  <span className="px-4"> {gift}</span>
                </div>
              ))}
              <small className=" mt-3 font-bold text-santa-blue">
                {copySuccess ? 'Skopiowano!' : 'Kliknij żeby skopiować'}
              </small>
              {!result.gift_suggestions && (
                <div className="flex items-center justify-between text-sm text-black-enough">
                  <img src="/images/giftbox.png" alt="" className="h-4 w-4" />
                  <span className="px-2">rózga</span>
                  <img src="/images/giftbox.png" alt="" className="h-4 w-4" />
                  <span className="px-2">
                    (bo nie zostały przekazane propozycje)
                  </span>
                </div>
              )}
          </span>
        </button>
      )}
    </div>
  );
};
