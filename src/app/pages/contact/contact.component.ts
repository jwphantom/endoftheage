import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { CountryService } from 'src/app/services/country.service';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';
import { GlobalConstants } from '../../common/global-constants';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  countries: any[] | undefined;
  countriesSubscription: Subscription | undefined;
  country = 'Canada';
  submitForm: boolean = false;

  contactForm!: FormGroup;

  private GEmail = GlobalConstants.email;


  constructor(private title: Title,
    private formBuilder: FormBuilder,
    private countryService: CountryService) { }

  ngOnInit() {
    this.title.setTitle("EndOfTheAge - Contact");

    this.storeCountries();

    this.addContactForm();


    this.loadScript('../assets/js/plugins.js');
    this.loadScript('../assets/js/main.js');
    this.loadScript('../assets/js/vendor/jquery-3.5.1.min.js');
    this.loadScript('../assets/js/vendor/jquery-migrate-3.3.0.min.js');

  }

  public loadScript(url: string) {
    const body = <HTMLDivElement>document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }

  storeCountries() {
    this.countries = this.countryService.countries;
  }

  addContactForm() {
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      country: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  submit() {

    $('#submitForm').show();
    $('#NSubmitForm').hide();

    const name = this.contactForm.get('name')?.value;
    const email = this.contactForm.get('email')?.value;
    const phone = this.contactForm.get('phone')?.value;
    const country = this.contactForm.get('country')?.value;
    const message = this.contactForm.get('message')?.value;

    var templateParams = {
      name: name,
      email: email,
      Gemail: this.GEmail,
      phone: phone,
      country: country,
      message: message,
    };


    emailjs.send('service_on11x8n', 'template_an65r6a', templateParams, 'user_yn1JMY7CtM4tXFI7FnkIf')
      .then((r) => {


        $('#flash_message_success').show();

        setTimeout(() => {
          $('#flash_message_success').hide();

        }, 3000);

        this.contactForm.reset();



        console.log('SUCCESS!', r.status, r.text);

        $('#submitForm').hide();
        $('#NSubmitForm').show();

      }, function (err) {

        $('#flash_message_notGranted').show();

        setTimeout(() => {
          $('#flash_message_notGranted').hide();

        }, 3000);


        console.log('FAILED...', err);
        $('#submitForm').hide();
        $('#NSubmitForm').show();
      });

  }

}
