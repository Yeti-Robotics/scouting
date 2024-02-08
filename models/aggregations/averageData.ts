
import { PipelineStage } from 'mongoose';

export const avgDataPipeline: PipelineStage[] = [
      {
        $group: {
          _id: '$teamNumber',
          autoAmpNotes: { $avg: '$autoAmpNotes' },
          autoSpeakerNotes: {
            $avg: '$autoSpeakerNotes'
          },
          autoNotesMissed: {
            $avg: '$autoNotesMissed'
          },
          teleopAmpNotes: {
            $avg: '$teleopAmpNotes'
          },
          teleopSpeakerNotes: {
            $avg: '$teleopSpeakerNotes'
          },
          teleopAmplifiedSpeakerNotes: {
            $avg: '$teleopAmplifiedSpeakerNotes'
          },
          teleopNotesMissed: {
            $avg: '$teleopNotesMissed'
          },
          trapAttempts: { $avg: '$trapAttempts' },
          trapNotes: { $avg: '$trapNotes' },
          climbSuccess: {
            $sum: { $cond: ['$climb', 1, 0] }
          },
          spotlightSuccess: {
            $sum: { $cond: ['$spotlight', 1, 0] }
          },
          forms: { $count: {} },
          numberOnChain: { $avg: '$numberOnChain' },
          defense: { $avg: '$defense' }
        }
      }
    ]
;