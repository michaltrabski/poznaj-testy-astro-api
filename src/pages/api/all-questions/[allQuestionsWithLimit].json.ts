import allQuestions from "../../../data/all-questions";
import type { APIRoute } from "astro";
import { LIMITS } from "../../../settings/settings";
import type { ApiResponse } from "../../../store/types";
import { createQuestionUrl } from "../../../utils/utils";

export interface Question {
  id: string;
  t: string;
  m?: string;
  r: string;
  cats: string[];
  s: number;
  a?: string;
  b?: string;
  c?: string;
}

export const get: APIRoute = ({ params, request }) => {
  const limit = +(params.allQuestionsWithLimit ?? "0");

  const allQuestionsShuffled = allQuestions.sort(
    () => Math.random() - 0.5
  ) as Question[];
  const allQuestionsLimited = allQuestionsShuffled.slice(0, limit);
  const allCategories = [
    ...new Set(allQuestionsLimited.flatMap((question) => question.cats)),
  ].sort() as string[];

  const questionsPerCategoryCountObj = {};
  const firstQuestionUrlsObj = {};

  allCategories.forEach((category) => {
    questionsPerCategoryCountObj[category] = allQuestionsLimited.filter(
      (question) => question.cats.includes(category)
    ).length;

    const firstQuestion = allQuestionsLimited.find((question) =>
      question.cats.includes(category)
    );

    if (firstQuestion) {
      firstQuestionUrlsObj[category] = createQuestionUrl(
        firstQuestion,
        category
      );
    }

    //   firstQuestionUrlsObj[category] = allQuestionsLimited.find((question: any) =>
    //   question.cats.includes(category)
    // ).id;
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
