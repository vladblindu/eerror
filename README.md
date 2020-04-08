![Extende error](_art/eerror-icon-sm.png)

EXTENDED ERROR
==============

(DON'T USE VERSIONS BELLOW 0.0.4)
### THIS IS A WIP PROJECT ###
Please contact me if you want to use it 
 

[![version](https://img.shields.io/github/package-json/version/vladblindu/eerror)](https://semver.org)
[![CircleCI](https://circleci.com/gh/vladblindu/flash-splash/tree/circleci-project-setup.svg?style=svg)](https://circleci.com/gh/vladblindu/flash-splash/tree/circleci-project-setup)

A module for those who, like me, had enough of "every module with it's own error format".
This module has a few, and hopefully growing, number of error formats defined. The point is to be able to issue
an, let's say, AuthError, that has a standard format (properties and methods extending the base Error class) 
and if a third party module and if a authError is raised by a third party module throws a auth error 
with ut's proprietary properties to "identify" this error as an AuthError instance and "initNormalize" it's properties
to this modules standard format.

There is a standard definition file template found in the docs directory.
The module will load only the requested definition, unless you opt-in for all. 

Detailed docs are still in TODO state.

### INSTALLATION

Standard github packages installation procedure

### LICENCE

Many thanks to all devs out there writing amazing open source code. Feel free to do whatever whit this piece of code.
No restriction (and no warranties, sorry!). Copy, modify, make millions and be free and happy.

### TODO 
- integration fail tests
- decent docs
- a cli tool to verify error definition files (this would be fancy, ain't it?)
- environment specific errors (ex: DevError in development mode)
- Winston logging && custom logging formats

As you see help is welcomed.