HOMEDIR ?= /home/deploy/$(ENVIRONMENT)

setup-environment:
	sudo mkdir -p /home/deploy && sudo mkdir -p $(HOMEDIR) && sudo chown -R $$(id -u):$$(id -g) $(HOMEDIR)
	sudo mkdir -p ~/.ssh && sudo chown -R $$(id -u):$$(id -g) ~/.ssh/
	sudo mkdir -p $(HOMEDIR)/.kube && sudo chown -R $$(id -u):$$(id -g) $(HOMEDIR)/.kube/
	sudo mkdir -p $(HOMEDIR)/.aws && sudo chown -R $$(id -u):$$(id -g) $(HOMEDIR)/.aws/
	echo $(GITHUB_ACTIONS_RUNNER_RSA) | base64 --decode > $(HOMEDIR)/id_rsa && chmod 400 $(HOMEDIR)/id_rsa && sudo mv $(HOMEDIR)/id_rsa ~/.ssh/
	ssh-keyscan github.com >> ~/.ssh/known_hosts

pull-k8s-yaml:
	cd $(HOMEDIR) && rm -fr $(K8S_YAML_REPO)/
	cd $(HOMEDIR) && git clone git@github.com:your-org/$(K8S_YAML_REPO).git

install-dependencies-k8s:
	cd $(HOMEDIR)/$(K8S_YAML_REPO)/github-actions-scripts && /bin/bash install-dependencies-k8s.sh

k8s_connect:
	cd $(HOMEDIR)/$(K8S_YAML_REPO)/github-actions-scripts && /bin/bash k8s-connect.sh

deploy_service:
	cd $(HOMEDIR)/$(K8S_YAML_REPO)/github-actions-scripts && /bin/bash deploy-service.sh