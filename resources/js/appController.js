var app = angular.module("app",['ngMaterial', 'ngMessages','ui.utils.masks', 'ngCpfCnpj', 'ngMdIcons', 'mdDataTable']);

app.filter("data", function() {
	var re = /\/Date\(([0-9]*)\)\//;
	return function(x) {
		var m = x.match(re);
		if( m ) return new Date(parseInt(m[1]));
		else return null;
	};
});

app.controller("appController",  function($scope, $window, $http, $interval, $mdDialog, $filter, $mdToast) { 

	$scope.operacao = 'I';
	$scope.indice = null;

	$scope.init =  function () {
		$scope.contatos = localStorage.getItem("lista");
		

		if ($scope.contatos == null ) {
			$scope.contatos = new Array();
			return false;
		}

		$scope.contatos = JSON.parse($scope.contatos);

	}

	$scope.buscaCep = function () {	
		if ($scope.contato.cep == "") {
			$scope.contato.endereco = null;
			$scope.contato.bairro = null;
			$scope.contato.cidade = null;
			$scope.contato.uf = null;
		} else {	
			$http.get("https://viacep.com.br/ws/" + $scope.contato.cep + "/json/ ").success(function(response) {
				$scope.contato.endereco = response.logradouro;
				$scope.contato.bairro = response.bairro;
				$scope.contato.cidade = response.localidade;
				$scope.contato.uf = response.uf;
			});		
		}
	}

	$scope.gravar = function () {
		
		if ($scope.operacao == 'E') {
			$scope.contatos[$scope.indice] = $scope.contato;
		} else {
			$scope.contatos.push($scope.contato);						
		}

		localStorage.setItem("lista", JSON.stringify($scope.contatos));

		$scope.contato = new Object();
		

		$scope.operacao = "I";

		alert("Contato Salvo");
	}

	$scope.removerTodos = function () {
		$scope.contatos = new Array();

		localStorage.setItem("lista", JSON.stringify($scope.contatos));
	}

	$scope.selecionar = function (contato, indice) {
		
		$scope.contato = new Object();
		$scope.contato.cpf = contato.cpf;
		$scope.contato.nome = contato.nome;
		$scope.contato.dtNascimento = contato.dtNascimento;
		$scope.contato.email = contato.email;
		$scope.contato.telefone = contato.telefone;
		$scope.contato.celular = contato.celular;
		$scope.contato.cep = contato.cep;
		$scope.contato.endereco = contato.endereco;
		$scope.contato.numero = contato.numero;
		$scope.contato.bairro = contato.bairro;
		$scope.contato.cidade = contato.cidade;
		$scope.contato.uf = contato.uf;

		// Converter a String da Date de Nascimento em Date
		$scope.contato.dtNascimento = new Date($filter('date')(contato.dtNascimento, "yyyy-MM-dd")); 

		$scope.operacao = 'E';
		$scope.indice = indice;
	}

	$scope.showConfirm = function(ev, contato, indice) {
	    // Appending dialog to document.body to cover sidenav in docs app
	    var confirm = $mdDialog.confirm()
	    .title('Confirmação')
	    .textContent('Confirma a exclusão do contato ' + contato.nome + "?")
	    .ariaLabel('Confirmação')
	    .targetEvent(ev)
	    .ok('Sim')
	    .cancel('Não');

	    $mdDialog.show(confirm).then(function() {
	    	$scope.contatos.splice(indice, 1);
	    	localStorage.setItem("lista", JSON.stringify($scope.contatos));

	    }, function() {
	    	$scope.status = 'You decided to keep your debt.';
	    });
	};

}).config(function($mdThemingProvider) {

    $mdThemingProvider.theme('default').primaryPalette('blue').accentPalette('orange');

}).config(function($mdDateLocaleProvider) {

	var locale = window.navigator.userLanguage || window.navigator.language;
	moment.locale(locale);
	
	$mdDateLocaleProvider.formatDate = function(date) {
		return moment(date).format('DD/MM/YYYY');
	}
}).filter('cpfFormatado', function() {
	return function(input, formatar) {
		out = "";
		if (input != undefined && input.length == 11 && formatar) {
			out += input.substring(0,3) + ".";
			out += input.substring(3,6) + ".";
			out += input.substring(6,9) + "-";
			out += input.substring(9, 11);
			return out;
		}
		return input;
	};
});