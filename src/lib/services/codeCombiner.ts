/**
 * Combines user code + test assertions into a single runnable Haskell module.
 *
 * The harness is defined once here. Each exercise's `testCode` field contains
 * only the assertion lines (e.g., `runTestEq "name" expected actual`).
 */

export interface CombinedCode {
  combined: string;
  userCodeLineOffset: number;
}

const USER_CODE_MARKER = '-- <<<USER_CODE>>>';
const TEST_MARKER = '-- <<<TEST_ASSERTIONS>>>';

const HARNESS_TEMPLATE = `module Main where

${USER_CODE_MARKER}

-- Test harness (no dependencies beyond base)
data TestResult = Pass String | Fail String String

runTest :: String -> Bool -> TestResult
runTest name True  = Pass name
runTest name False = Fail name "assertion failed"

runTestEq :: (Show a, Eq a) => String -> a -> a -> TestResult
runTestEq name expected actual
  | expected == actual = Pass name
  | otherwise          = Fail name ("Expected " ++ show expected ++ " but got " ++ show actual)

runTestApprox :: String -> Double -> Double -> Double -> TestResult
runTestApprox name expected actual epsilon
  | abs (expected - actual) < epsilon = Pass name
  | otherwise = Fail name ("Expected ~" ++ show expected ++ " but got " ++ show actual)

printResult :: TestResult -> IO ()
printResult (Pass name)     = putStrLn ("PASS: " ++ name)
printResult (Fail name msg) = putStrLn ("FAIL: " ++ name ++ ": " ++ msg)

countResults :: [TestResult] -> (Int, Int)
countResults = foldl (\\(p, f) r -> case r of { Pass _ -> (p+1, f); Fail _ _ -> (p, f+1) }) (0, 0)

main :: IO ()
main = do
  let results =
        [ ${TEST_MARKER}
        ]
  putStrLn ">>>TEST_RESULTS_START<<<"
  mapM_ printResult results
  putStrLn ">>>TEST_RESULTS_END<<<"
  let (p, f) = countResults results
  putStrLn (">>>SUMMARY: " ++ show p ++ " passed, " ++ show f ++ " failed<<<")
`;

/** Strip the `module X where` line from user code. */
function stripModuleDeclaration(code: string): string {
  return code.replace(/^module\s+\w+(\.\w+)*\s+where\s*$/m, '');
}

export function combineCode(userCode: string, testAssertions: string): CombinedCode {
  const strippedUser = stripModuleDeclaration(userCode).trim();

  // Count lines before user code in the template
  const beforeMarker = HARNESS_TEMPLATE.split(USER_CODE_MARKER)[0];
  const userCodeLineOffset = beforeMarker.split('\n').length - 1;

  const combined = HARNESS_TEMPLATE
    .replace(USER_CODE_MARKER, strippedUser)
    .replace(TEST_MARKER, testAssertions.trim());

  return { combined, userCodeLineOffset };
}
