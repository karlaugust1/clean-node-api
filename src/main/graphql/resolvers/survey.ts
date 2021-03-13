import { adaptResolver } from "../../adapters/apollo-server-resolver-adapter"
import {
    makeLoadSurveysController
} from "../../factories/controllers/survey/load-surveys/load-surveys-controller-factory"

/* eslint-disable */
export default {
    Query: {
        surveys: async () => adaptResolver(makeLoadSurveysController())
    }
}