import json

from definitions import NRC_JSON_PATH


class NRC:
    """
    This class uses the NRC lexicon for creating an emotional signature for each text given
    """

    def __init__(self):
        with open(NRC_JSON_PATH) as file:
            self._lexicon = json.load(file)

    def get_emotional_signature(self, text: str) -> (dict, int):
        """ This method translates given text to emotional signature

        :param text:
        :return: emotional signature and number of words in the text
        """
        text = text.lower()
        words = text.split()

        emotional_signature = {
            "anger": 0,
            "anticipation": 0,
            "disgust": 0,
            "fear": 0,
            "joy": 0,
            "negative": 0,
            "positive": 0,
            "sadness": 0,
            "surprise": 0,
            "trust": 0
        }

        count_words = 0
        for word in words:
            try:
                word_signature = self._lexicon[word]
                for key, val in word_signature.items():
                    emotional_signature[key] += val

                # check if has any emotional value
                has_emotion = False
                for val in emotional_signature.values():
                    if val > 0:
                        has_emotion = True

                if has_emotion:
                    count_words += 1


            except KeyError:
                continue

        return emotional_signature, count_words


nrcLexicon = NRC()

if __name__ == '__main__':
    nrc = NRC()
    text = "is are good bad"
    print(nrc.get_emotional_signature(text))
