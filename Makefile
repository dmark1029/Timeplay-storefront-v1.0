.PHONY: test build

REPO_NAME := "ships-web-client"
VERSION := "0.0.0-0"
BUILD_DIR := "./build"

test:
	echo "TODO: Create tests"

build:
	@test $${NPM_TOKEN?Please set environment variable NPM_TOKEN}
	rm -rf ${BUILD_DIR}
	mkdir ${BUILD_DIR}

	# Build
	node -v
	cp .env.ci .env
	NPM_TOKEN="${NPM_TOKEN}" npm run build-ci

	# zip frontend code
	cd ${BUILD_DIR} && zip -r ${REPO_NAME}.zip .
