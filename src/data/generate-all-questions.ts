const fs = require("fs-extra");
const path = require("path");
const excelToJson = require("convert-excel-to-json");

const EXCEL_FILE_NAME_WITH_QUESTIONS_DATA_FROM_GOV =
  "Baza_pytań_na_egzamin_na_prawo_jazdy_22_02_2022r.xlsx";

console.log(
  "generating allQuestions from excel===",
  EXCEL_FILE_NAME_WITH_QUESTIONS_DATA_FROM_GOV
);

const EXCEL_SHEET_NAME_WITH_QUESTIONS_DATA_FROM_GOV = "Treść pytania";

const excelContent = excelToJson({
  sourceFile: path.resolve(
    __dirname,
    EXCEL_FILE_NAME_WITH_QUESTIONS_DATA_FROM_GOV
  ),
  columnToKey: { "*": "{{columnHeader}}" },
  header: {
    // Is the number of rows that will be skipped and will not be present at our result object. Counting from top to bottom
    rows: 1, // 2, 3, 4, etc.
  },
});

const allQuestionsFromExcel =
  excelContent[EXCEL_SHEET_NAME_WITH_QUESTIONS_DATA_FROM_GOV];

// interface SingleQuestion {
//   id: string;
//   t: string;
//   m?: string;
//   r: string;
//   cats: string[];
//   s: number;
//   a?: string;
//   b?: string;
//   c?: string;
// }

// : SingleQuestion[]

const allQuestions = allQuestionsFromExcel.map((question) => {
  const newQuestion = {
    id: `id${question["Numer pytania"]}`,
    t: question["Pytanie"],
    r: question["Poprawna odp"].toLowerCase(),
    cats: question["Kategorie"].toLowerCase().split(","),
    s: question["Liczba punktów"],
  };

  const media = question["Media"];

  if (media) {
    newQuestion.m = media.replace(".wmv", ".mp4").replace(".jpg", ".png");
  }

  const a = question["Odpowiedź A"];

  if (a) {
    newQuestion.a = a;
    newQuestion.b = question["Odpowiedź B"];
    newQuestion.c = question["Odpowiedź C"];
  }

  return newQuestion;
});

fs.writeJsonSync(path.resolve(__dirname, "all-questions.json"), allQuestions);

console.log("allQuestions.length: ", allQuestions.length);
