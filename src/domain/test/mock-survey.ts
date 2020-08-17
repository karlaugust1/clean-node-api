import { SurveyModel } from "../models/survey";
import { AddSurveyParams } from "../usecases/survey/add-survey";

export const mockSurveyData = (): AddSurveyParams => ({
    question: "any_question",
    answers: [{
        image: "any_image",
        answer: "any_answer"
    }],
    date: new Date()
})

export const mockSurveyModel = (): SurveyModel => ({ ...mockSurveyData(), id: "any_id" })

export const mockSurveysModel = (): SurveyModel[] => [{
    id: "any_id",
    question: "any_question",
    answers: [{
        image: "any_image",
        answer: "any_answer"
    }],
    date: new Date()
}, {
    id: "other_id",
    question: "other_question",
    answers: [{
        image: "other_image",
        answer: "other_answer"
    }],
    date: new Date()
}]