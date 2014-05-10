require 'spec_helper'

feature "user signing in" do

  background do
    # Unclear why this didn't have to be set
    # request.env["devise.mapping"] = Devise.mappings[:user]
    # request.env["omniauth.auth"] = OmniAuth.config.mock_auth[:facebook]
  end

  scenario "should sign in with facebook" do
    valid_sign_in_with_facebook
    expect(page).to have_content('Sign out')
  end

  scenario "should not sign in with facebook with invalid credentials" do
    invalid_sign_in_with_facebook
    visit '/'
    expect(page).to_not have_content("Sign out")
  end

  scenario "should sign" do
    create_test_user('John Doe', 'john@doe.com', 'abc12345')
    sign_in('john@doe.com', 'abc12345')
    expect(page).to have_content('Sign out')
  end

  scenario "should not sign in with invalid information" do
    create_test_user('John Doe', 'john@doe.com', 'abc12345')
    sign_in('john@doe.com', 'abc12344')
    expect(page).to have_content('Invalid')
  end
end
