HELM_TAG := $(shell helm show chart helm/ | grep '^version:' | awk '{print $$2}')
GIT_SHA := $(shell git rev-parse --short HEAD)
TAG := $(HELM_TAG)-$(GIT_SHA)

.PHONY: helm-lint
helm-lint:
	helm lint helm/

.PHONY: helm-build
helm-build: helm-lint
	helm package helm/ --version $(TAG)
	
.PHONY: tag
tag:
	@echo $(TAG)