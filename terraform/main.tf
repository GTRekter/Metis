################################################################
 Initialization
################################################################
terraform {
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
      version = "~>3.0"
    }
  }
  backend "azurerm" {}
}
provider "azurerm" {
  features {}
  skip_provider_registration = false
}
################################################################
 Resources
################################################################
resource "azurerm_resource_group" "resource_group" {
  name     = "rg-${var.application_name}-${var.location_alias}-${var.environment}-01"
  location = ""
}
resource "azurerm_static_site" "static_site" {
  name                = "rg-${var.application_name}-${var.location_alias}-${var.environment}-01"
  location            = azurerm_resource_group.example.location
  resource_group_name = azurerm_resource_group.example.name
  sku_tier            = "Free"
  sku_size            = "Free"
}
resource "azurerm_cognitive_account" "cognitive_account" {
  name                = "csa-${var.application_name}-${var.location_alias}-${var.environment}-01"
  location            = azurerm_resource_group.example.location
  resource_group_name = azurerm_resource_group.example.name
  kind                = "Speech"
  sku_name            = "F0"
}