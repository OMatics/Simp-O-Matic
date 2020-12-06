import sys
from textgenrnn import textgenrnn
textgen = textgenrnn(weights_path='instgen_weights.hdf5',
                       vocab_path='instgen_vocab.json',
                       config_path='instgen_config.json')
if sys.argv[3] = 'None'
	pref = None
else
	pref = sys.argv[3]
textgen.generate(temperature=int(sys.argv[1]), prefix=pref, n=1, max_gen_length=int(sys.argv[2]))