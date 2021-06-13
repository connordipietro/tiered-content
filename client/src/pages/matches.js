import useIsAccountSetup from '../utilities/accountSetupHook';

export const MatchesPage = () => {
  const isAccountSetup = useIsAccountSetup();

  return (
    <>
      {!isAccountSetup ? <h1>Redirecting</h1> : null}
      <div />
    </>
  );
};

export default MatchesPage;
