import allQuestions from "../../../data/all-questions";
import type { APIRoute } from "astro";
import { LIMITS } from "../../../settings/settings";
import type { ApiResponse } from "../../../store/types";

export const get: APIRoute = ({ params, request }) => {
  const limit = +(params.allQuestionsWithLimit ?? "0");

  const allQuestionsShuffled = allQuestions.sort(() => Math.random() - 0.5);
  const allQuestionsLimited = allQuestionsShuffled.slice(0, limit);
  const allCategories = [
    ...new Set(allQuestionsLimited.flatMap((question: any) => question.cats)),
  ].sort() as string[];

  const questionsPerCategoryCountObj = {};
  const firstQuestionUrlsObj = {};

  allCategories.forEach((category) => {
    questionsPerCategoryCountObj[category] = allQuestionsLimited.filter(
      (question: any) => question.cats.includes(category)
    ).length;

    firstQuestionUrlsObj[category] = allQuestionsLimited.find((question: any) =>
      question.cats.includes(category)
    ).id;
  });

  const apiResponse: ApiResponse = {
    allCategories,
    questionsPerCategoryCountObj,
    firstQuestionUrlsObj,
    allQuestionsCount: allQuestionsLimited.length,
    allQuestions: allQuestionsLimited,
  };
  return {
    body: JSON.stringify(apiResponse),
  };
};

export function getStaticPaths() {
  const limitsArray = Object.entries(LIMITS).map(
    ([limitKey, limitValue]) => limitValue
  );

  return limitsArray.map((limitValue) => {
    return {
      params: { allQuestionsWithLimit: limitValue.toString() },
    };
  });

  // return Array.from(
  //   { length: allQuestion.length + 1 },
  //   (_, index) => index
  // ).map((id) => ({ params: { allQuestionsWithLimit: id.toString() } }));
  // return [
  //   { params: { id: "0" } },
  //   { params: { id: "1" } },
  //   { params: { id: "2" } },
  // ];
}
