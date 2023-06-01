const checkRadioAnswer = (i, questions, total) => {
  console.log(
    Array.isArray(total?.[i]?.correctAnswer),
    total?.[i]?.correctAnswer.map((ele) => ele.value),
    questions?.[i]?.userAnswer
  );
  if (
    Array.isArray(total?.[i]?.correctAnswer) &&
    total?.[i]?.correctAnswer
      .map((ele) => ele.value)
      .includes(questions?.[i]?.userAnswer)
  ) {
    return { ...total?.[i], ...questions?.[i], is: "right" };
  } else {
    return { ...total?.[i], ...questions?.[i], is: "wrong" };
  }
};
const checkCheckBoxAnswer = (i, questions, total) => {
  if (
    Array.isArray(total?.[i]?.correctAnswer) &&
    Array.isArray(questions?.[i]?.userAnswer) &&
    total?.[i]?.correctAnswer.length === questions?.[i]?.userAnswer.length &&
    total?.[i]?.correctAnswer
      .map((ele) => ele.value)
      .includes(questions?.[i]?.userAnswer)
  ) {
    return { ...total?.[i], ...questions?.[i], is: "right" };
  } else {
    return { ...total?.[i], ...questions?.[i], is: "wrong" };
  }
};
const checkFIBAnswer = (i, questions, total) => {
  if (
    Array.isArray(total?.[i]?.correctAnswer) &&
    total?.[i]?.correctAnswer
      .map((ele) => ele.value.toLowerCase())
      .includes(questions?.[i]?.userAnswer.toLowerCase())
  ) {
    return { ...total?.[i], ...questions?.[i], is: "right" };
  } else {
    return { ...total?.[i], ...questions?.[i], is: "wrong" };
  }
};
const checkAnswer = (i, questions, total, type) => {
  console.log(questions?.[i]?.action, questions?.[i]?.action);
  if (
    questions?.[i]?.action === "FINISHED" ||
    questions?.[i]?.action === "REVIEW"
  ) {
    switch (type) {
      case "RADIO":
        return checkRadioAnswer(i, questions, total);
      case "CHECKBOX":
        return checkCheckBoxAnswer(i, questions, total);
      case "FIB":
        return checkFIBAnswer(i, questions, total);
      default:
        break;
    }
  } else if (questions?.[i]?.action === "NOTANSWERED") {
    return { ...total?.[i], ...questions?.[i], is: "not-answered" };
  } else {
    return { ...total?.[i], ...questions?.[i], is: "wrong" };
  }
};

const giveMeAnswer = (q, t, e) => {
  console.log(q, t, e, "ppppppppppppppppppppppp");
  let exam = e;
  let questions = q;
  let count = 0;
  let total = t;
  let allQuestion = [];
  let correctAnswer = [];
  let wrongAnswer = [];
  let notAnswered = [];

  const maintainAnswer = (r) => {
    switch (r.is) {
      case "right":
        count = count + 1;
        correctAnswer = [...correctAnswer, r];
        break;
      case "wrong":
        wrongAnswer = [...wrongAnswer, r];
        break;
      case "not-answered":
        notAnswered = [...notAnswered, r];
        break;
      default:
        break;
    }
  };

  if (questions.length === total.length) {
    for (let i = 0; i < questions.length; i++) {
      console.log(questions?.[i]?.typeOfQuestion, total?.[i]?.typeOfQuestion);
      if (
        questions?.[i]?.typeOfQuestion === "RADIO" &&
        total?.[i]?.typeOfQuestion === "RADIO"
      ) {
        let r = checkAnswer(i, questions, total, "RADIO");
        maintainAnswer(r);
      } else if (
        questions?.[i]?.typeOfQuestion === "CHECKBOX" &&
        total?.[i]?.typeOfQuestion === "CHECKBOX"
      ) {
        let r = checkAnswer(i, questions, total, "CHECKBOX");
        maintainAnswer(r);
      } else if (
        questions?.[i]?.typeOfQuestion === "FIB" &&
        total?.[i]?.typeOfQuestion === "FIB"
      ) {
        let r = checkAnswer(i, questions, total, "FIB");
        maintainAnswer(r);
      }

      allQuestion = [...allQuestion, { ...total?.[i], ...questions?.[i] }];
    }
    let result = {
      testId: exam.testId,
      correctAnswer: {
        count,
        array: correctAnswer,
        percentage: (count / total.length) * 100,
      },
      wrongAnswer: {
        count: wrongAnswer?.length,
        array: wrongAnswer,
        percentage: (wrongAnswer?.length / total.length) * 100,
      },

      notAnswered: {
        count: notAnswered?.length,
        array: notAnswered,
        percentage: (notAnswered?.length / total.length) * 100,
      },

      totalQuestion: {
        count: allQuestion.length,
        array: allQuestion,
      },
      scoreType: "percentile",
    };
    return result;
  }
};

module.exports = giveMeAnswer;
