import random as rnd
import string
import numpy as np
import datetime

teams = [
    118,
    148,
    254,
    1678,
    3506,
    9998,
    900,
    1533,
    7890,
    4795,
    4829,
    179,
    180,
    8727,
    2910,
    1538,
    2485,
    3255,
    9449,
    3667,
    3647,
    4290,
    9006,
    4247,
    4414,
    1323,
    2565,
    4295,
    8116,
    9900,
    2582,
]


def generate_stand_form(
    username: string,
    match_number: int,
    alliance: string,
    teamNumber: int,
    teamSkill: float,
):
    teleopSpeakerNotes = np.random.poisson(8 * teamSkill)
    teleopAmplifiedSpeakerNotes = np.random.poisson(3.5 * teamSkill)
    teleopAmplifiedSpeakerNotes = (
        teleopSpeakerNotes
        if teleopAmplifiedSpeakerNotes > teleopSpeakerNotes
        else teleopAmplifiedSpeakerNotes
    )

    autoAmpNotes = np.random.poisson(0.9 * teamSkill)
    autoSpeakerNotes = np.random.poisson(0.8 * teamSkill)
    teleopAmpNotes = np.random.poisson(4 * teamSkill)

    trapAttempts = np.random.poisson(0.52 * teamSkill)
    trapNotes = min(np.random.poisson(0.35 * teamSkill), trapAttempts)

    climb = True if rnd.random() < 1.2 * teamSkill else False
    climb_points = 3 if True else False

    score = (
        autoAmpNotes * 2
        + autoSpeakerNotes * 5
        + teleopAmpNotes * 1
        + teleopSpeakerNotes * 2
        + teleopAmplifiedSpeakerNotes * 5
        + trapNotes * 5
        + climb_points
    )

    return {
        "teamNumber": teamNumber,
        "matchNumber": match_number,
        "setNumber": 1,
        "scouter": username,
        "autoAmpNotes": autoAmpNotes,
        "autoSpeakerNotes": autoSpeakerNotes,
        "autoNotesMissed": np.random.poisson(0.8 * teamSkill),
        "teleopAmpNotes": teleopAmpNotes,
        "teleopSpeakerNotes": teleopSpeakerNotes,
        "teleopAmplifiedSpeakerNotes": teleopAmplifiedSpeakerNotes,
        "teleopNotesMissed": np.random.poisson(8 * teamSkill),
        "trapAttempts": trapAttempts,
        "trapNotes": trapNotes,
        "preload": True,
        "initiationLine": True if rnd.random() < 0.9 else False,
        "climb": climb,
        "spotlight": True if rnd.random() < 0.82 * teamSkill else False,
        "numberOnChain": 1 if climb else 0,
        "penalties": np.random.poisson(0.5),
        "defense": round(np.random.uniform(1, 5)),
        "approved": True,
        "notes": "here's a note",
        "scoutScore": score,
        "eventID": "testEvent2024",
        "alliance": alliance,
        "createdAt": datetime.datetime.now(),
        "updatedAt": datetime.datetime.now(),
        "__v": 0,
    }
