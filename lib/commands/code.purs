module Code where

import Prelude
import Effect.Console (log)

import Node.Encoding (Encoding(UTF8))
import Node.FS.Sync (readTextFile)

import Data.Function.Uncurried (Fn2)
import Foreign.Object


module ../utils where
	foreign import glue_strings :: Fn2 [String] Number [String]

module ../extensions where
	foreign import FORMATS :: Object


