import React, { Component } from 'react';
import getData from '../data/notes';
import EmptyNotes from './empty/EmptyNotes';
import Footer from './footer/Footer';
import Search from './header/Search';
import Jumbotron from './main/jumbotron';
import ModalInput from './main/modal-input';
import NotesList from './main/notes-list';

class NoteApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notes: getData(),
      showModal: false,
      archives: [],
      search: [],
    };

    this.onShowModal = this.onShowModal.bind(this);
    this.onHideModal = this.onHideModal.bind(this);
    this.onDeleteNote = this.onDeleteNote.bind(this);
    this.onAddNoteHandler = this.onAddNoteHandler.bind(this);
    this.onSearchNoteHandler = this.onSearchNoteHandler.bind(this);
    this.onArchiveNoteHandler = this.onArchiveNoteHandler.bind(this);
    this.onUnarchive = this.onUnarchive.bind(this);
  }

  onAddNoteHandler({
    title,
    body,
    createdAt,
    archived,
  }) {
    this.setState((prevState) => ({
      notes: [
        ...prevState.notes,
        {
          id: +new Date(),
          title,
          body,
          createdAt,
          archived,
        },
      ],
    }));
  }

  onSearchNoteHandler({ title }) {
    if (title.length === 0) {
      this.setState({ search: [] });
      return;
    }
    let { search } = this.state;
    const { notes, archives } = this.state;
    search = notes.filter((note) => (
      note.title.toLowerCase().includes(title.toLowerCase())
    ));

    if (archives.length !== 0) {
      search = archives.filter((note) => (
        note.title.toLowerCase().includes(title.toLowerCase())
      ));
    }
    this.setState({ search });
  }

  onDeleteNote(id) {
    let { notes, archives } = this.state;
    notes = notes.filter((note) => note.id !== id);
    this.setState({ notes });
    if (archives.length !== 0) {
      archives = archives.filter((note) => note.id !== id);
      this.setState({ archives });
    }
  }

  onArchiveNoteHandler(id) {
    let { notes } = this.state;
    const [archives] = notes.filter((note) => note.id === id);
    notes = notes.filter((note) => note.id !== id);
    archives.archived = true;

    this.setState((prevState) => ({
      archives: [...prevState.archives, archives],
    }));
    this.setState({ notes });
  }

  onUnarchive(id) {
    let { archives } = this.state;
    const [notes] = archives.filter((archive) => archive.id === id);
    archives = archives.filter((archive) => archive.id !== id);
    notes.archive = false;

    this.setState((prevState) => ({
      notes: [...prevState.notes, notes],
    }));
    this.setState({ archives });
  }

  onShowModal() {
    this.setState({ showModal: true });
  }

  onHideModal() {
    this.setState({ showModal: false });
  }

  render() {
    const { showModal, archives, search } = this.state;
    let { notes } = this.state;
    if (search.length !== 0) {
      notes = search;
    }
    return (
      <>
        <header>
          <h1>Note App</h1>
          <Search search={this.onSearchNoteHandler} />
        </header>
        <main>
          <ModalInput
            show={showModal}
            closeModal={this.onHideModal}
            addNote={this.onAddNoteHandler}
          />
          <Jumbotron showModal={this.onShowModal} />
          {notes.length === 0 && archives.length === 0 ? (
            <EmptyNotes />
          ) : (
            <>
              <NotesList
                notes={notes}
                onDelete={this.onDeleteNote}
                onArchive={this.onArchiveNoteHandler}
              />

              <NotesList
                notes={archives}
                onDelete={this.onDeleteNote}
                onArchive={this.onArchiveNoteHandler}
                onUnarchive={this.onUnarchive}
              />
            </>
          )}
        </main>
        <Footer />
      </>
    );
  }
}

export default NoteApp;
