import { LoadSurveysRepository } from "../../protocols/db/survey/load-surveys-repository"
import { SurveyModel } from "../../../domain/models/survey"
import { DbLoadSurveys } from "./db-load-surveys"

const makeFakeSurveys = (): SurveyModel[] => [{
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

const makeLoadSurveysRepositoryStub = (): LoadSurveysRepository => {
    class LoadSurveysRepositoryStub implements LoadSurveysRepository {

        async loadAll(): Promise<SurveyModel[]> {
            return Promise.resolve(makeFakeSurveys())
        }

    }

    return new LoadSurveysRepositoryStub()
}
interface SutTypes {
    sut: DbLoadSurveys
    loadSurveysRepositoryStub: LoadSurveysRepository
}

const makeSut = (): SutTypes => {
    const loadSurveysRepositoryStub = makeLoadSurveysRepositoryStub()
    const sut = new DbLoadSurveys(loadSurveysRepositoryStub)

    return {
        sut,
        loadSurveysRepositoryStub
    }
}

describe("DbLoadSurveys", () => {
    test("Should call LoadSurveysRepository", async () => {
        const { sut, loadSurveysRepositoryStub } = makeSut()
        const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, "loadAll")
        await sut.load()
        expect(loadAllSpy).toHaveBeenCalled()
    })
})
